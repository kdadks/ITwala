export type ResourceCategory = 
  | 'AI & Business Strategy' 
  | 'Core AI Tech' 
  | 'AI Learning & Career' 
  | 'Startup & Product';

export interface ResourceFAQ {
  question: string;
  answer: string;
}

export interface ResourceSection {
  h2: string;
  content?: string;
  codeSnippet?: string;
  image?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface ResourceCTA {
  title: string;
  text: string;
  linkText: string;
  linkUrl: string;
  variant: 'consulting' | 'academy' | 'product';
}

export interface ResourceArticle {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  quickAnswer: string;
  primaryGoal: string;
  category: ResourceCategory;
  readTime: string;
  publishDate: string;
  updatedDate: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'published' | 'draft';
  featuredImage?: string;
  keywords: string[];
  schemaType: 'TechArticle' | 'Article' | 'HowTo';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  cta: ResourceCTA;
  keyTakeaways: string[];
  faqs: ResourceFAQ[];
  sections: ResourceSection[];
}
