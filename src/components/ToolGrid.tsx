import { AITool } from "@/types/tool";
import ToolCard from "./ToolCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Grid3X3, List } from "lucide-react";

interface ToolGridProps {
  tools: AITool[];
  onCompare?: (tool: AITool) => void;
  comparingTools?: AITool[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ToolGrid = ({ 
  tools, 
  onCompare, 
  comparingTools = [], 
  sortBy, 
  onSortChange,
  viewMode,
  onViewModeChange 
}: ToolGridProps) => {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {tools.length} tools found
            </span>
            {comparingTools.length > 0 && (
              <Badge variant="secondary" className="bg-gradient-secondary">
                {comparingTools.length} comparing
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px]">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-r-none border-r border-border"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      {tools.length > 0 ? (
        <div 
          className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
          }
        >
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onCompare={onCompare}
              isComparing={comparingTools.some(t => t.id === tool.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Grid3X3 className="w-12 h-12 mx-auto opacity-20" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No tools found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolGrid;