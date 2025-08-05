import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Target, 
  Zap, 
  ArrowRight,
  FileText,
  Image,
  Code,
  Video,
  Briefcase,
  Star
} from "lucide-react";
import FeaturedTools3D from "@/components/FeaturedTools3D";

const Index = () => {
  const featuredCategories = [
    {
      icon: FileText,
      name: "Text & Writing",
      description: "AI tools for content creation, writing assistance, and text analysis",
      toolCount: 156,
      popular: ["ChatGPT", "Claude", "Jasper"]
    },
    {
      icon: Image,
      name: "Image & Design", 
      description: "Generate, edit, and enhance images with AI-powered creativity",
      toolCount: 89,
      popular: ["MidJourney", "DALL-E", "Canva AI"]
    },
    {
      icon: Code,
      name: "Development",
      description: "Code assistants, automation tools, and development accelerators",
      toolCount: 78,
      popular: ["GitHub Copilot", "Tabnine", "Replit"]
    },
    {
      icon: Video,
      name: "Video & Media",
      description: "Video generation, editing, and multimedia content creation",
      toolCount: 45,
      popular: ["Runway ML", "Pika Labs", "Synthesia"]
    },
    {
      icon: Briefcase,
      name: "Productivity",
      description: "Boost your workflow with AI-powered productivity tools",
      toolCount: 67,
      popular: ["Notion AI", "Otter.ai", "Grammarly"]
    }
  ];

  const topTools = [
    { name: "ChatGPT", category: "Text & Writing", rating: 4.8, pricing: "Freemium", isPopular: true },
    { name: "MidJourney", category: "Image & Design", rating: 4.7, pricing: "Paid", isTrending: true },
    { name: "GitHub Copilot", category: "Development", rating: 4.5, pricing: "Paid", isPopular: true },
    { name: "Runway ML", category: "Video & Media", rating: 4.6, pricing: "Freemium", isTrending: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturedTools3D />
      
      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground">
              Browse by
              <span className="bg-gradient-primary bg-clip-text text-transparent ml-4">
                Category
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From image generation to code assistance — find exactly what you need across our curated categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.name} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <Badge variant="outline" className="border-border">
                          {category.toolCount} tools
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {category.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Popular Tools</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {category.popular.map((tool) => (
                            <Badge key={tool} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full group-hover:bg-gradient-secondary">
                        Explore Category
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Tools Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground">
              This Week's
              <span className="bg-gradient-primary bg-clip-text text-transparent ml-4">
                Top Picks
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The most popular and trending AI tools, handpicked by our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topTools.map((tool, index) => (
              <Card key={tool.name} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-border">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold text-primary-foreground">
                        #{index + 1}
                      </div>
                      {tool.isPopular && (
                        <Badge className="absolute -top-2 -right-2 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                          Popular
                        </Badge>
                      )}
                      {tool.isTrending && (
                        <Badge className="absolute -top-2 -right-2 bg-gradient-primary">
                          Trending
                        </Badge>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">{tool.category}</p>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{tool.rating}</span>
                      </div>
                      <Badge variant="outline" className="border-border">
                        {tool.pricing}
                      </Badge>
                    </div>

                    <Button variant="outline" size="sm" className="w-full group-hover:bg-gradient-secondary">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect AI Tool?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who discover, compare, and choose the best AI tools for their projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/tools">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  <Target className="w-5 h-5 mr-2" />
                  Browse All Tools
                </Button>
              </a>
              <Button size="lg" variant="outline">
                <Sparkles className="w-5 h-5 mr-2" />
                Submit Your Tool
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
