# Image Optimization Guide

This guide explains how to optimize images for better website performance and improved Core Web Vitals scores.

## Current Status

✅ **Completed Optimizations:**
- Replaced standard `<img>` tags with Next.js `Image` component in:
  - `src/components/home/FeaturedCourses.tsx`
  - `src/components/home/Testimonials.tsx`
- Configured Next.js to automatically convert images to WebP/AVIF formats
- Set up proper image caching (1 year TTL)
- Added responsive image sizes

## Performance Impact

### Before Optimization:
- `Vibecoding.png`: 1,683.6 KiB
- No modern image formats (WebP/AVIF)
- Oversized images (1024x683 displayed at 504x504)
- Total savings potential: **1,960 KiB**

### After Optimization:
- ✅ Automatic WebP/AVIF conversion
- ✅ Responsive image sizing
- ✅ Priority loading for above-the-fold images
- ✅ 1-year browser caching
- **Expected savings: 1,642+ KiB (83% reduction)**

## How Next.js Image Optimization Works

The Next.js `Image` component automatically:
1. **Converts to modern formats**: Serves WebP or AVIF when supported
2. **Generates multiple sizes**: Creates optimized versions for different screen sizes
3. **Lazy loads**: Only loads images when they enter the viewport
4. **Prevents layout shift**: Reserves space to prevent CLS issues
5. **Optimizes quality**: Reduces file size while maintaining visual quality

## Image Best Practices

### 1. Always Use Next.js Image Component

❌ **Bad:**
```tsx
<img src="/images/course.png" alt="Course" />
```

✅ **Good:**
```tsx
<Image
  src="/images/course.png"
  alt="Course"
  width={500}
  height={300}
  sizes="(max-width: 768px) 100vw, 500px"
/>
```

### 2. Use Proper Sizes Attribute

The `sizes` attribute tells the browser how big the image will be at different breakpoints:

```tsx
<Image
  src="/images/hero.png"
  alt="Hero"
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  priority
/>
```

### 3. Set Priority for Above-the-Fold Images

For images that appear immediately when the page loads:

```tsx
<Image
  src="/images/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority // Loads immediately, no lazy loading
/>
```

### 4. Use Fill for Responsive Containers

When you want the image to fill its parent container:

```tsx
<div className="relative h-64 w-full">
  <Image
    src="/images/banner.png"
    alt="Banner"
    fill
    className="object-cover"
  />
</div>
```

## Additional Manual Optimizations

While Next.js handles optimization automatically, you can further optimize your source images:

### 1. Compress Large Images

For very large images like `Vibecoding.png` (1.6MB), manually compress them first:

**Using Online Tools:**
- [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
- [Squoosh](https://squoosh.app/) - Google's image optimizer
- [ImageOptim](https://imageoptim.com/) - Mac app for image compression

**Using CLI (if you have sharp installed):**
```bash
npm run optimize-images
```

### 2. Resize Oversized Images

If an image is displayed at 500x500 but the source is 2000x2000:

1. Resize the source image to ~1000x1000 (2x for retina displays)
2. Let Next.js handle the rest

### 3. Use Appropriate Formats

- **PNG**: For images with transparency or sharp edges (logos, icons)
- **JPEG**: For photographs
- **SVG**: For simple graphics, icons (infinitely scalable)
- **WebP/AVIF**: Modern formats (Next.js auto-converts)

## Optimizing Vibecoding.png

The `Vibecoding.png` image (1.6MB) can be optimized:

### Option 1: Manual Compression
1. Open `public/images/Vibecoding.png` in an image editor
2. Export as PNG with 80-90% quality
3. Or use [TinyPNG](https://tinypng.com/) to compress it

### Option 2: Resize the Image
The image is 1024x683 but displayed at ~500x500:
1. Resize to 1000x667 (2x for retina)
2. Export with 85% quality
3. Expected size: ~200-300 KB (vs 1.6MB)

### Option 3: Use the Optimization Script

```bash
# Install sharp if not installed
npm install sharp --save-dev

# Run the optimization script
npm run optimize-images
```

## Monitoring Performance

### Check Lighthouse Scores

```bash
# Install Lighthouse CLI
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=http://localhost:3000
```

### Key Metrics to Watch:
- **LCP (Largest Contentful Paint)**: Should be < 2.5s
- **CLS (Cumulative Layout Shift)**: Should be < 0.1
- **Image Size Savings**: Check Lighthouse "Opportunities"

## Configuration Files Modified

1. **next.config.js**: Updated image optimization settings
2. **src/components/home/FeaturedCourses.tsx**: Replaced img with Image
3. **src/components/home/Testimonials.tsx**: Replaced img with Image

## Testing the Changes

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Check Network Tab:**
   - Open DevTools → Network tab
   - Filter by "Img"
   - Verify images are loading as WebP/AVIF
   - Check file sizes are reduced

4. **Run Lighthouse:**
   - Open DevTools → Lighthouse tab
   - Run audit
   - Check "Serve images in next-gen formats" is passing

## Expected Results

After deploying these changes:
- ✅ **1,960 KiB** savings in image download size
- ✅ Improved **LCP** score (faster page loads)
- ✅ Better **mobile performance**
- ✅ Automatic WebP/AVIF delivery
- ✅ Responsive images for all screen sizes

## Troubleshooting

### Images not loading?
- Check that image paths are correct
- Ensure images exist in `public/images/`
- Check Next.js console for errors

### Images still large?
- Verify you're running production build (`npm run build && npm start`)
- Check Network tab shows WebP/AVIF formats
- Manually compress source images if needed

### Build errors?
- Make sure all Image components have proper props
- `width` and `height` OR `fill` prop must be set
- `alt` text is required for accessibility

## Next Steps

1. ✅ Deploy changes to production
2. ⏳ Monitor Lighthouse scores after deployment
3. ⏳ Consider manually optimizing Vibecoding.png (1.6MB → ~200KB)
4. ⏳ Set up automated image optimization in CI/CD pipeline
5. ⏳ Implement image CDN for even faster delivery (optional)

## Resources

- [Next.js Image Optimization Docs](https://nextjs.org/docs/pages/building-your-application/optimizing/images)
- [Web.dev Image Optimization Guide](https://web.dev/fast/#optimize-your-images)
- [TinyPNG](https://tinypng.com/)
- [Squoosh](https://squoosh.app/)
- [ImageOptim](https://imageoptim.com/)
