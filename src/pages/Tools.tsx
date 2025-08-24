import { useState, useMemo } from "react";
import { mockTools } from "@/data/mockTools";
import { AITool, SearchFilters } from "@/types/tool";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ToolGrid from "@/components/ToolGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, ArrowRight, GitCompare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Tools = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'popularity'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [comparingTools, setComparingTools] = useState<AITool[]>([]);

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let filtered = mockTools.filter(tool => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query) ||
          tool.tags.some(tag => tag.toLowerCase().includes(query)) ||
          tool.features.some(feature => feature.toLowerCase().includes(query))
        );
      }
      return true;
    });

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(tool => tool.category === filters.category);
    }

    // Pricing filter
    if (filters.pricing && filters.pricing.length > 0) {
      filtered = filtered.filter(tool => filters.pricing!.includes(tool.pricing.type));
    }

    // Platform filter
    if (filters.platforms && filters.platforms.length > 0) {
      filtered = filtered.filter(tool => 
        filters.platforms!.some(platform => tool.platforms.includes(platform as any))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'popularity':
        filtered.sort((a, b) => {
          const aScore = (a.isPopular ? 10 : 0) + (a.isTrending ? 5 : 0) + a.reviewCount / 1000;
          const bScore = (b.isPopular ? 10 : 0) + (b.isTrending ? 5 : 0) + b.reviewCount / 1000;
          return bScore - aScore;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price':
        filtered.sort((a, b) => {
          const aPrice = a.pricing.startingPrice || 0;
          const bPrice = b.pricing.startingPrice || 0;
          return aPrice - bPrice;
        });
        break;
    }

    return filtered;
  }, [searchQuery, filters]);

  const handleCompare = (tool: AITool) => {
    if (comparingTools.find(t => t.id === tool.id)) {
      setComparingTools(comparingTools.filter(t => t.id !== tool.id));
    } else if (comparingTools.length < 3) {
      setComparingTools([...comparingTools, tool]);
    }
  };

  const removeFromComparison = (toolId: string) => {
    setComparingTools(comparingTools.filter(t => t.id !== toolId));
  };

  const clearComparison = () => {
    setComparingTools([]);
  };

  const goToComparePage = () => {
    // Store selected tools in sessionStorage to pass to compare page
    sessionStorage.setItem('compareTools', JSON.stringify(comparingTools));
    navigate('/compare');
  };

  const updateFilters = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4 h-[calc(100vh-7rem)] flex flex-col">
              {/* Search - Fixed */}
              <div className="relative flex-shrink-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters - Scrollable with custom scrollbar */}
              <div className="flex-1 relative overflow-hidden">
                <div className="h-full overflow-y-auto pr-2 scrollbar-thin">
                  <CategoryFilter
                    selectedCategory={filters.category}
                    onCategoryChange={(category) => updateFilters('category', category)}
                    selectedPricing={filters.pricing || []}
                    onPricingChange={(pricing) => updateFilters('pricing', pricing)}
                    selectedPlatforms={filters.platforms || []}
                    onPlatformChange={(platforms) => updateFilters('platforms', platforms)}
                    toolCount={filteredTools.length}
                  />
                </div>
                {/* Fade gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-2 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 relative">
            <ToolGrid
              tools={filteredTools}
              onCompare={handleCompare}
              comparingTools={comparingTools}
              sortBy={filters.sortBy || 'popularity'}
              onSortChange={(sort) => updateFilters('sortBy', sort)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>

        {/* Comparison Toolbar - Sticky Bottom */}
        {comparingTools.length > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
            <Card className="bg-card/95 backdrop-blur-lg border-2 border-primary/20 shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <GitCompare className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-sm">Compare Tools</span>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {comparingTools.length}/3
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {comparingTools.map(tool => (
                        <div key={tool.id} className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                          <span className="text-xs font-medium truncate max-w-20">{tool.name}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromComparison(tool.id)}
                            className="h-4 w-4 p-0 hover:bg-destructive/20"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={clearComparison}>
                      Clear All
                    </Button>
                    <Button
                      size="sm"
                      onClick={goToComparePage}
                      className="bg-gradient-primary hover:opacity-90"
                      disabled={comparingTools.length < 2}
                    >
                      Compare Now
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;
