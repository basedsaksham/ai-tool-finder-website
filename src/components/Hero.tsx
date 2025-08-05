import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Zap, Target, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import ThreeBackground from "./ThreeBackground";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* 3D Background */}
      <ThreeBackground />
      
      {/* Netflix-style overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-60" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Netflix-style badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 px-6 py-3 rounded-full mb-8 animate-fade-in">
            <Play className="w-5 h-5 text-primary fill-current" />
            <span className="text-lg font-medium text-primary">The Ultimate AI Tool Discovery Platform</span>
          </div>

          {/* Main Heading - Netflix style */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            Discover
            <span className="bg-gradient-primary bg-clip-text text-transparent animate-pulse">
              AI Tools
            </span>
            <br />
            <span className="text-muted-foreground text-4xl md:text-5xl lg:text-6xl">
              That Actually Work
            </span>
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed">
            Netflix for AI tools. Curated, reviewed, and ready to transform your workflow.
            From ChatGPT to MidJourney — find what you need, fast.
          </p>

          {/* Netflix-style search bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6 z-10" />
              <Input 
                className="pl-16 pr-6 py-6 text-xl border-2 border-border/50 bg-background/80 backdrop-blur-lg rounded-2xl focus:border-primary transition-all duration-300 group-hover:border-primary/50"
                placeholder="What do you want to create? (e.g., 'generate stunning images', 'write better code')"
              />
              <a href="/tools" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:opacity-90 px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Find Tools
                </Button>
              </a>
            </div>
          </div>

          {/* Netflix-style popular searches */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <span className="text-lg text-muted-foreground">Popular:</span>
            {["Image Generation", "Text Summarization", "Code Assistant", "Video Creation", "Audio Editing"].map((tag) => (
              <Button 
                key={tag} 
                variant="outline" 
                size="lg" 
                className="border-border hover:bg-gradient-secondary hover:border-primary transition-all duration-300"
              >
                {tag}
              </Button>
            ))}
          </div>

          {/* Netflix-style stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-foreground mb-2">500+</div>
              <div className="text-lg text-muted-foreground">AI Tools Indexed</div>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-foreground mb-2">Smart</div>
              <div className="text-lg text-muted-foreground">Matching Algorithm</div>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-foreground mb-2">Free</div>
              <div className="text-lg text-muted-foreground">Forever</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;