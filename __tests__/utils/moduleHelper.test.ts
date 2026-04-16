import { generateModuleId, hydrateModuleIds } from '../../src/utils/moduleHelper';
import type { Course } from '../../src/types/course';

const MINIMAL_COURSE: Course = {
  id: 'course-abc',
  slug: 'course-abc',
  title: 'Test Course',
  description: 'A test course',
  price: 1000,
  image: '/test.jpg',
  category: 'Technology',
  level: 'Beginner',
  learningOutcomes: [],
  requirements: [],
  modules: [
    {
      id: '',
      title: 'Module One',
      description: 'First module',
      lessons: [],
    },
    {
      id: 'existing-id',
      title: 'Module Two',
      description: 'Second module',
      lessons: [],
    },
  ],
  reviews: [],
};

describe('moduleHelper', () => {
  describe('generateModuleId', () => {
    it('generates an id from courseId and 0-based index', () => {
      expect(generateModuleId('course-abc', 0)).toBe('course-abc-m1');
      expect(generateModuleId('course-abc', 4)).toBe('course-abc-m5');
    });
  });

  describe('hydrateModuleIds', () => {
    it('fills in missing module ids', () => {
      const hydrated = hydrateModuleIds(MINIMAL_COURSE);
      expect(hydrated.modules[0].id).toBe('course-abc-m1');
    });

    it('preserves existing module ids', () => {
      const hydrated = hydrateModuleIds(MINIMAL_COURSE);
      expect(hydrated.modules[1].id).toBe('existing-id');
    });

    it('does not mutate the original course object', () => {
      hydrateModuleIds(MINIMAL_COURSE);
      expect(MINIMAL_COURSE.modules[0].id).toBe('');
    });

    it('returns a Course with the same top-level fields', () => {
      const hydrated = hydrateModuleIds(MINIMAL_COURSE);
      expect(hydrated.title).toBe(MINIMAL_COURSE.title);
      expect(hydrated.price).toBe(MINIMAL_COURSE.price);
    });
  });
});
