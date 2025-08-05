import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Zap, Target } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-secondary px-4 py-2 rounded-full border border-border mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Discover the perfect AI tool for your needs</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Find the{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Perfect AI Tool
            </span>
            {" "}for Your Project
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Search, compare, and discover the best AI tools from ChatGPT to MidJourney. 
            Smart matching based on your specific needs and budget.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                className="pl-12 pr-4 py-4 text-lg border-border bg-background/50 backdrop-blur"
                placeholder="Describe what you want to do... (e.g., 'generate art', 'summarize PDFs')"
              />
              <a href="/tools">
                <Button 
                  size="lg" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-primary hover:opacity-90"
                >
                  Find Tools
                </Button>
              </a>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["Image Generation", "Text Summarization", "Code Assistant", "Video Creation", "Audio Editing"].map((tag) => (
              <Button 
                key={tag} 
                variant="outline" 
                size="sm" 
                className="border-border hover:bg-gradient-secondary"
              >
                {tag}
              </Button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">500+</div>
              <div className="text-muted-foreground">AI Tools Indexed</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">Smart</div>
              <div className="text-muted-foreground">Matching Algorithm</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">Free</div>
              <div className="text-muted-foreground">Forever</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;