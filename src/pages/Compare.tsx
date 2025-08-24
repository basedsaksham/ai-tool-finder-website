import { useState, useEffect } from "react";
import { mockTools } from "@/data/mockTools";
import { AITool } from "@/types/tool";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Star, ExternalLink, X, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Compare = () => {
  const { toast } = useToast();
  const [selectedTools, setSelectedTools] = useState<AITool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  // Load pre-selected tools from sessionStorage on component mount
  useEffect(() => {
    const storedTools = sessionStorage.getItem('compareTools');
    if (storedTools) {
      try {
        const tools = JSON.parse(storedTools);
        if (Array.isArray(tools)) {
          setSelectedTools(tools);
        }
      } catch (error) {
        console.error('Error parsing stored comparison tools:', error);
      }
      // Clear the stored tools after loading
      sessionStorage.removeItem('compareTools');
    }
  }, []);

  const categories = [
    "Text & Writing",
    "Image & Design", 
    "Video & Media",
    "Development",
    "Productivity",
    "Music & Audio"
  ];

  const filteredTools = mockTools.filter(tool => {
    const matchesSearch = searchQuery === "" || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === "all" || tool.category === category;
    
    return matchesSearch && matchesCategory && !selectedTools.find(t => t.id === tool.id);
  });

  const addTool = (tool: AITool) => {
    if (selectedTools.length >= 3) {
      toast({
        title: "Maximum tools reached",
        description: "You can compare up to 3 tools at once. Remove a tool to add another.",
        variant: "destructive",
      });
      return;
    }

    setSelectedTools([...selectedTools, tool]);
    toast({
      title: "Tool added to comparison",
      description: `${tool.name} has been added to your comparison.`,
    });
  };

  const removeTool = (toolId: string) => {
    setSelectedTools(selectedTools.filter(t => t.id !== toolId));
  };

  const getPricingDisplay = (tool: AITool) => {
    if (tool.pricing.type === 'free') return 'Free';
    if (tool.pricing.type === 'freemium') return 'Freemium';
    if (tool.pricing.type === 'enterprise') return 'Enterprise';
    return `$${tool.pricing.startingPrice}/${tool.pricing.billingPeriod === 'monthly' ? 'mo' : 'yr'}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Compare AI Tools
          </h1>
          <p className="text-muted-foreground">
            Compare up to 3 AI tools side by side to find the perfect solution for your needs.
          </p>
        </div>

        {/* Search and Filter Controls - Always Visible */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                {selectedTools.length === 0 ? 'Select Tools to Compare' : 'Add More Tools'}
                <Badge variant="secondary" className="ml-auto">
                  {selectedTools.length}/3 selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Show available tools if less than 3 are selected */}
              {selectedTools.length < 3 && (
                <>
                  {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {filteredTools.slice(0, 12).map(tool => (
                        <Card key={tool.id} className="cursor-pointer hover:shadow-md transition-all duration-200 border-dashed hover:border-solid hover:border-primary/50 hover:bg-primary/5"
                          onClick={() => addTool(tool)}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-sm">{tool.name}</h3>
                              <Plus className="w-4 h-4 text-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 overflow-hidden"
                               style={{
                                 display: '-webkit-box',
                                 WebkitLineClamp: 2,
                                 WebkitBoxOrient: 'vertical'
                               }}>
                              {tool.shortDescription}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs">{tool.rating}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">{tool.category}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No tools found matching your search criteria.</p>
                      <p className="text-sm">Try adjusting your search or category filter.</p>
                    </div>
                  )}
                </>
              )}

              {selectedTools.length === 3 && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="font-medium">Maximum of 3 tools reached</p>
                  <p className="text-sm">Remove a tool below to add a different one.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedTools.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Comparing {selectedTools.length} tool{selectedTools.length > 1 ? 's' : ''}
              </h2>
              <div className="flex gap-2">
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Add more tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>


            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedTools.length}, 1fr)` }}>
              {selectedTools.map(tool => (
                <Card key={tool.id} className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTool(tool.id)}
                    className="absolute top-2 right-2 z-10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <CardHeader>
                    <CardTitle className="text-lg pr-8">{tool.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{tool.shortDescription}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Rating & Reviews</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{tool.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({tool.reviewCount} reviews)</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Pricing</h4>
                      <Badge variant="secondary">{getPricingDisplay(tool)}</Badge>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Category</h4>
                      <p className="text-sm">{tool.category}</p>
                      {tool.subcategory && (
                        <p className="text-xs text-muted-foreground">{tool.subcategory}</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Platforms</h4>
                      <div className="flex flex-wrap gap-1">
                        {tool.platforms.map(platform => (
                          <Badge key={platform} variant="outline" className="text-xs capitalize">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Features</h4>
                      <ul className="text-sm space-y-1">
                        {tool.features.slice(0, 5).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Pros</h4>
                      <ul className="text-sm space-y-1">
                        {tool.pros.slice(0, 3).map((pro, index) => (
                          <li key={index} className="flex items-start gap-2 text-green-600 dark:text-green-400">
                            <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Cons</h4>
                      <ul className="text-sm space-y-1">
                        {tool.cons.slice(0, 3).map((con, index) => (
                          <li key={index} className="flex items-start gap-2 text-red-600 dark:text-red-400">
                            <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90"
                      onClick={() => window.open(tool.website, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit {tool.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Compare;
