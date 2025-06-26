// Usage: node scripts/generateCourseSQLfromJson.js > courses.sql
const fs = require('fs');

const courses = JSON.parse(fs.readFileSync('allCourses.json', 'utf8'));

function escape(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
  return val;
}

// Map JS keys to DB columns (adjust as needed for your schema)
const fields = [
  'id',
  'slug',
  'title',
  'description',
  'category',
  'price',
  'originalPrice',
  'status',
  'level',
  'duration',
  'resources',
  'image',
  'publishedDate',
  'thumbnail'
];

console.log('-- SQL insert statements for Supabase courses table');
courses.forEach(course => {
  const values = fields.map(f => escape(course[f]));
  console.log(`INSERT INTO courses (${fields.join(', ')}) VALUES (${values.join(', ')});`);
});
console.log('-- Done. Copy/paste these into Supabase SQL editor.');
