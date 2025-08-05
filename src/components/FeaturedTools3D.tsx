import ToolCards3D from "@/components/ToolCards3D";
import { mockTools } from "@/data/mockTools";
import { AITool } from "@/types/tool";

const FeaturedTools3D = () => {
  const handleToolClick = (tool: AITool) => {
    // Open tool details or navigate to tools page
    window.open(tool.website, '_blank');
  };

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground">
            Featured
            <span className="bg-gradient-primary bg-clip-text text-transparent ml-4">
              AI Tools
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interact with our top-rated AI tools in 3D. Click and explore the most popular choices.
          </p>
        </div>
        
        <div className="relative">
          <ToolCards3D 
            tools={mockTools.slice(0, 6)} 
            onToolClick={handleToolClick}
          />
        </div>
        
        <div className="text-center mt-12">
          <a href="/tools">
            <button className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-glow">
              Explore All Tools →
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTools3D;