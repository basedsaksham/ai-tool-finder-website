import { Button } from "@/components/ui/button";
import { Search, Star, Filter } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-primary-foreground" fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Tool Finder
          </h1>
        </a>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">Browse Tools</a>
          <a href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">Categories</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Compare</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Submit Tool
          </Button>
          <Button size="sm" className="bg-gradient-primary hover:opacity-90">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;