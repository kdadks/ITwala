import type { Course, Module } from '../types/course';

// Helper function to generate module IDs for courses
export function generateModuleId(courseId: string, moduleIndex: number): string {
  return `${courseId}-m${moduleIndex + 1}`;
}

export function hydrateModuleIds(course: Course): Course {
  return {
    ...course,
    modules: course.modules.map((module: Module, index: number) => ({
      ...module,
      id: module.id || generateModuleId(course.id, index),
    })),
  };
}
