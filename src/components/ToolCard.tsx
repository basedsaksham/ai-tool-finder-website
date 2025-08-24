import { AITool } from "@/types/tool";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, TrendingUp, Heart, Check } from "lucide-react";

interface ToolCardProps {
  tool: AITool;
  onCompare?: (tool: AITool) => void;
  isComparing?: boolean;
}

const ToolCard = ({ tool, onCompare, isComparing }: ToolCardProps) => {
  const getPricingBadge = () => {
    switch (tool.pricing.type) {
      case 'free':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">Free</Badge>;
      case 'freemium':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Freemium</Badge>;
      case 'paid':
        return <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
          ${tool.pricing.startingPrice}/{tool.pricing.billingPeriod === 'monthly' ? 'mo' : 'yr'}
        </Badge>;
      case 'enterprise':
        return <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">Enterprise</Badge>;
    }
  };

  return (
    <Card className={`group relative overflow-hidden border-border bg-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 hover:scale-105 ${
      isComparing ? 'ring-2 ring-primary border-primary/50 shadow-glow' : ''
    }`}
      style={{
        background: isComparing
          ? 'linear-gradient(145deg, hsl(var(--primary)/0.05), hsl(var(--card)/0.95))'
          : 'linear-gradient(145deg, hsl(var(--card)), hsl(var(--card)/0.95))',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Trending/Popular indicators */}
      <div className="absolute top-3 right-3 flex gap-1">
        {tool.isTrending && (
          <div className="bg-gradient-primary px-2 py-1 rounded-md flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-primary-foreground" />
            <span className="text-xs font-medium text-primary-foreground">Trending</span>
          </div>
        )}
        {tool.isPopular && !tool.isTrending && (
          <div className="bg-gradient-secondary px-2 py-1 rounded-md border border-border">
            <span className="text-xs font-medium text-foreground">Popular</span>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {tool.shortDescription}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{tool.rating}</span>
            <span className="text-xs text-muted-foreground">({tool.reviewCount})</span>
          </div>
          {getPricingBadge()}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-3">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</span>
            <p className="text-sm text-foreground">{tool.category}</p>
          </div>
          
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Features</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {tool.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs border-border">
                  {feature}
                </Badge>
              ))}
              {tool.features.length > 3 && (
                <Badge variant="outline" className="text-xs border-border">
                  +{tool.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Platforms</span>
            <div className="flex gap-1 mt-1">
              {tool.platforms.map((platform) => (
                <Badge key={platform} variant="secondary" className="text-xs capitalize">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex gap-2">
        <Button
          variant={isComparing ? "default" : "outline"}
          size="sm"
          className={`flex-1 ${isComparing ? 'bg-primary text-primary-foreground' : ''}`}
          onClick={() => onCompare?.(tool)}
        >
          {isComparing ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Selected
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 mr-2" />
              Compare
            </>
          )}
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-gradient-primary hover:opacity-90"
          onClick={() => window.open(tool.website, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Visit Site
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
