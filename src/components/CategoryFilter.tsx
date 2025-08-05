import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  FileText, 
  Image, 
  Video, 
  Code, 
  Briefcase, 
  Mic, 
  BarChart3,
  Filter,
  X
} from "lucide-react";

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (category: string | undefined) => void;
  selectedPricing: string[];
  onPricingChange: (pricing: string[]) => void;
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
  toolCount: number;
}

const categories = [
  { id: "Text & Writing", name: "Text & Writing", icon: FileText, count: 156 },
  { id: "Image & Design", name: "Image & Design", icon: Image, count: 89 },
  { id: "Video & Media", name: "Video & Media", icon: Video, count: 45 },
  { id: "Development", name: "Development", icon: Code, count: 78 },
  { id: "Productivity", name: "Productivity", icon: Briefcase, count: 67 },
  { id: "Audio", name: "Audio", icon: Mic, count: 34 },
  { id: "Analytics", name: "Analytics", icon: BarChart3, count: 28 },
];

const pricingTypes = [
  { id: "free", name: "Free", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  { id: "freemium", name: "Freemium", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { id: "paid", name: "Paid", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  { id: "enterprise", name: "Enterprise", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" }
];

const platforms = [
  { id: "web", name: "Web" },
  { id: "mobile", name: "Mobile" },
  { id: "desktop", name: "Desktop" },
  { id: "api", name: "API" }
];

const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  selectedPricing,
  onPricingChange,
  selectedPlatforms,
  onPlatformChange,
  toolCount
}: CategoryFilterProps) => {
  const hasActiveFilters = selectedCategory || selectedPricing.length > 0 || selectedPlatforms.length > 0;

  const clearAllFilters = () => {
    onCategoryChange(undefined);
    onPricingChange([]);
    onPlatformChange([]);
  };

  const togglePricing = (pricing: string) => {
    if (selectedPricing.includes(pricing)) {
      onPricingChange(selectedPricing.filter(p => p !== pricing));
    } else {
      onPricingChange([...selectedPricing, pricing]);
    }
  };

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onPlatformChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Filters</h2>
          <Badge variant="secondary" className="ml-2">
            {toolCount} tools
          </Badge>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Categories</h3>
        <div className="space-y-1">
          <Button
            variant={selectedCategory === undefined ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onCategoryChange(undefined)}
            className="w-full justify-start h-auto py-2"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="flex-1 text-left">All Categories</span>
            <Badge variant="outline" className="ml-2">
              {categories.reduce((sum, cat) => sum + cat.count, 0)}
            </Badge>
          </Button>
          
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
                className="w-full justify-start h-auto py-2"
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="flex-1 text-left">{category.name}</span>
                <Badge variant="outline" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Pricing */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Pricing</h3>
        <div className="space-y-2">
          {pricingTypes.map((pricing) => (
            <div key={pricing.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={pricing.id}
                checked={selectedPricing.includes(pricing.id)}
                onChange={() => togglePricing(pricing.id)}
                className="rounded border-border"
              />
              <label htmlFor={pricing.id} className="flex-1 cursor-pointer">
                <Badge variant="secondary" className={pricing.color}>
                  {pricing.name}
                </Badge>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Platforms */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Platforms</h3>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={platform.id}
                checked={selectedPlatforms.includes(platform.id)}
                onChange={() => togglePlatform(platform.id)}
                className="rounded border-border"
              />
              <label htmlFor={platform.id} className="flex-1 cursor-pointer">
                <Badge variant="outline" className="capitalize">
                  {platform.name}
                </Badge>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;