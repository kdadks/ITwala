// Export allCourses to a JSON file for SQL generation
import { allCourses } from '../src/data/allCourses';
import { writeFileSync } from 'fs';

writeFileSync('allCourses.json', JSON.stringify(allCourses, null, 2));
console.log('Exported allCourses to allCourses.json');
