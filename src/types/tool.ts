export interface AITool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory?: string;
  website: string;
  pricing: {
    type: 'free' | 'freemium' | 'paid' | 'enterprise';
    startingPrice?: number;
    currency?: string;
    billingPeriod?: 'one-time' | 'monthly' | 'annual';
  };
  features: string[];
  platforms: ('web' | 'mobile' | 'api' | 'desktop')[];
  rating: number;
  reviewCount: number;
  pros: string[];
  cons: string[];
  useCases: string[];
  tags: string[];
  logo?: string;
  screenshots?: string[];
  videoDemo?: string;
  isPopular?: boolean;
  isTrending?: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  toolCount: number;
  subcategories?: ToolCategory[];
}

export interface SearchFilters {
  category?: string;
  pricing?: string[];
  platforms?: string[];
  rating?: number;
  sortBy?: 'popularity' | 'rating' | 'name' | 'price';
}

export interface ComparisonTool extends AITool {
  comparisonScore?: number;
}