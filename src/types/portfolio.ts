export interface PortfolioMetric {
  label: string;
  value: string;
}

export interface PortfolioItem {
  id?: string;
  title: string;
  description: string;
  industry: string;
  category: 'Mobile App' | 'Web Platform' | 'E-commerce' | 'Healthcare';
  href: string;
  logo: string;
  color: 'indigo' | 'pink' | 'cyan' | 'green' | 'blue';
  features: string[];
  technologies: string[];
  impact: string;
  metrics: PortfolioMetric[];
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface PortfolioFormData extends Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'> {}
