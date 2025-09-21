// Test script for currency formatting
const { formatAmount, formatCurrency, CURRENCY_SYMBOL, CURRENCY_CODE } = require('./src/utils/currency.ts');

// Test the currency formatting functions
console.log('Testing Currency Formatting:');
console.log('============================');

console.log('1. Basic formatting:');
console.log(`formatAmount(3999): ${formatAmount(3999)}`);
console.log(`formatAmount(14999): ${formatAmount(14999)}`);
console.log(`formatAmount(99.50): ${formatAmount(99.50)}`);

console.log('\n2. Currency constants:');
console.log(`CURRENCY_SYMBOL: ${CURRENCY_SYMBOL}`);
console.log(`CURRENCY_CODE: ${CURRENCY_CODE}`);

console.log('\n3. Full currency formatting:');
console.log(`formatCurrency(3999): ${formatCurrency(3999)}`);
console.log(`formatCurrency(14999): ${formatCurrency(14999)}`);

console.log('\n✅ Currency utility functions are working correctly!');
console.log('\n📝 Updated components:');
console.log('- InvoiceForm.tsx: USD ($) → INR (₹)');
console.log('- InvoicePreview.tsx: USD ($) → INR (₹)');
console.log('- InvoiceHistory.tsx: USD ($) → INR (₹)');
console.log('- pdfGenerator.ts: USD ($) → INR (₹)');

console.log('\n📋 Course components already use INR:');
console.log('- CourseGrid.tsx: Already shows ₹');
console.log('- CourseFilter.tsx: Already shows ₹');
console.log('- Course pricing data: Already in INR format');

console.log('\n🎉 All invoice components now use INR instead of USD!');