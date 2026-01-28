#!/usr/bin/env node

/**
 * Image Optimization Script
 * Compresses and resizes large images in the public/images directory
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is installed
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('\n❌ Error: sharp is not installed.');
  console.log('\n📦 Install sharp with:');
  console.log('   npm install --save-dev sharp\n');
  process.exit(1);
}

const imagesDir = path.join(__dirname, '../public/images');
const backupDir = path.join(__dirname, '../public/images/original-backups');

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Configuration
const config = {
  maxWidth: 2000,        // Maximum width in pixels
  maxHeight: 2000,       // Maximum height in pixels
  quality: 85,           // Quality for JPEG/PNG (1-100)
  minSizeForOptimization: 500000, // Only optimize files larger than 500KB
};

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get all image files
function getImageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip backup directory
      if (item !== 'original-backups') {
        files.push(...getImageFiles(fullPath));
      }
    } else if (/\.(png|jpe?g)$/i.test(item)) {
      files.push(fullPath);
    }
  });

  return files;
}

// Optimize a single image
async function optimizeImage(filePath) {
  const relativePath = path.relative(imagesDir, filePath);
  const stats = fs.statSync(filePath);
  const originalSize = stats.size;

  // Skip if file is already small
  if (originalSize < config.minSizeForOptimization) {
    console.log(`${colors.dim}   Skipping ${relativePath} (already optimized: ${formatBytes(originalSize)})${colors.reset}`);
    return { skipped: true, originalSize, newSize: originalSize };
  }

  console.log(`\n${colors.blue}📸 Optimizing: ${relativePath}${colors.reset}`);
  console.log(`   Original size: ${colors.yellow}${formatBytes(originalSize)}${colors.reset}`);

  try {
    // Create backup
    const backupPath = path.join(backupDir, relativePath);
    const backupDirPath = path.dirname(backupPath);
    if (!fs.existsSync(backupDirPath)) {
      fs.mkdirSync(backupDirPath, { recursive: true });
    }

    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`   ${colors.dim}✓ Backup created${colors.reset}`);
    }

    // Get image metadata
    const metadata = await sharp(filePath).metadata();
    console.log(`   Dimensions: ${metadata.width}x${metadata.height}`);

    // Determine if resize is needed
    const needsResize = metadata.width > config.maxWidth || metadata.height > config.maxHeight;

    // Process image
    let sharpInstance = sharp(filePath);

    if (needsResize) {
      sharpInstance = sharpInstance.resize(config.maxWidth, config.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
      console.log(`   ${colors.yellow}⚠ Resizing to fit ${config.maxWidth}x${config.maxHeight}${colors.reset}`);
    }

    // Optimize based on format
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      sharpInstance = sharpInstance.jpeg({ quality: config.quality, mozjpeg: true });
    } else if (metadata.format === 'png') {
      sharpInstance = sharpInstance.png({ quality: config.quality, compressionLevel: 9 });
    }

    // Save optimized image to a temp file first
    const tempPath = filePath + '.tmp';
    await sharpInstance.toFile(tempPath);

    // Check new size
    const newStats = fs.statSync(tempPath);
    const newSize = newStats.size;
    const savedBytes = originalSize - newSize;
    const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

    // Only replace if we actually saved space
    if (newSize < originalSize) {
      fs.renameSync(tempPath, filePath);
      console.log(`   ${colors.green}✓ Optimized: ${formatBytes(newSize)} (saved ${formatBytes(savedBytes)} / ${savedPercent}%)${colors.reset}`);
      return { optimized: true, originalSize, newSize, savedBytes };
    } else {
      fs.unlinkSync(tempPath);
      console.log(`   ${colors.dim}✓ No optimization needed${colors.reset}`);
      return { skipped: true, originalSize, newSize: originalSize };
    }

  } catch (error) {
    console.error(`   ${colors.red}✗ Error: ${error.message}${colors.reset}`);
    return { error: true, originalSize, newSize: originalSize };
  }
}

// Main function
async function main() {
  console.log(`\n${colors.bold}${colors.blue}🖼️  Image Optimization Tool${colors.reset}\n`);
  console.log(`${colors.dim}Scanning: ${imagesDir}${colors.reset}\n`);

  const imageFiles = getImageFiles(imagesDir);

  if (imageFiles.length === 0) {
    console.log(`${colors.yellow}No images found to optimize.${colors.reset}\n`);
    return;
  }

  console.log(`Found ${colors.bold}${imageFiles.length}${colors.reset} images\n`);
  console.log(`${colors.dim}Configuration:${colors.reset}`);
  console.log(`   Max dimensions: ${config.maxWidth}x${config.maxHeight}`);
  console.log(`   Quality: ${config.quality}%`);
  console.log(`   Min size for optimization: ${formatBytes(config.minSizeForOptimization)}`);

  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let optimizedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const filePath of imageFiles) {
    const result = await optimizeImage(filePath);

    totalOriginalSize += result.originalSize;
    totalNewSize += result.newSize;

    if (result.optimized) optimizedCount++;
    else if (result.skipped) skippedCount++;
    else if (result.error) errorCount++;
  }

  // Summary
  const totalSaved = totalOriginalSize - totalNewSize;
  const totalSavedPercent = ((totalSaved / totalOriginalSize) * 100).toFixed(1);

  console.log(`\n${colors.bold}${colors.blue}Summary${colors.reset}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Total images processed: ${colors.bold}${imageFiles.length}${colors.reset}`);
  console.log(`   ${colors.green}✓ Optimized: ${optimizedCount}${colors.reset}`);
  console.log(`   ${colors.dim}○ Skipped: ${skippedCount}${colors.reset}`);
  if (errorCount > 0) {
    console.log(`   ${colors.red}✗ Errors: ${errorCount}${colors.reset}`);
  }
  console.log(`\nOriginal size: ${colors.yellow}${formatBytes(totalOriginalSize)}${colors.reset}`);
  console.log(`New size: ${colors.green}${formatBytes(totalNewSize)}${colors.reset}`);
  console.log(`${colors.bold}${colors.green}Total saved: ${formatBytes(totalSaved)} (${totalSavedPercent}%)${colors.reset}\n`);

  if (optimizedCount > 0) {
    console.log(`${colors.dim}💡 Original images backed up to: ${path.relative(process.cwd(), backupDir)}${colors.reset}\n`);
  }
}

// Run
main().catch(error => {
  console.error(`\n${colors.red}Fatal error: ${error.message}${colors.reset}\n`);
  process.exit(1);
});
