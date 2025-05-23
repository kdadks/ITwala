// Helper function to generate module IDs for courses
export function generateModuleId(courseId: string, moduleIndex: number): string {
  return `${courseId}-m${moduleIndex + 1}`;
}

export function hydrateModuleIds(course: any): any {
  return {
    ...course,
    modules: course.modules.map((module: any, index: number) => ({
      ...module,
      id: module.id || generateModuleId(course.id, index),
    })),
  };
}
