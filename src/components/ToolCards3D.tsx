import { useState, useMemo, useRef, useEffect } from 'react';
import { AITool } from '@/types/tool';

interface ToolCards3DProps {
  tools: AITool[];
  onToolClick?: (tool: AITool) => void;
}

const ToolCards3D = ({ tools, onToolClick }: ToolCards3DProps) => {
  const visibleTools = tools.slice(0, 6);
  const [highlightedTool, setHighlightedTool] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for subtle interactions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);
        
        setMousePosition({ x, y });
        
        // Subtle speed variation based on mouse position
        const distance = Math.sqrt(x * x + y * y);
        const speed = 0.8 + distance * 0.4; // Gentle speed variation
        setRotationSpeed(speed);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Get tool logo component
  const getToolLogo = (toolName: string) => {
    const logoComponents: { [key: string]: JSX.Element } = {
      'ChatGPT': (
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
          </svg>
        </div>
      ),
      'MidJourney': (
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md"></div>
          </div>
        </div>
      ),
      'GitHub Copilot': (
        <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
            <path d="M12 0c6.63 0 12 5.37 12 12 0 5.31-3.44 9.82-8.2 11.4-.6-.55-.93-1.33-.93-2.2v-1.96c0-.67-.23-1.14-.69-1.4 2.24-.25 4.6-1.1 4.6-4.97 0-1.1-.39-2-.73-2.62.1-.25.32-1.29-.09-2.69 0 0-.84-.27-2.75 1.02-.8-.22-1.65-.33-2.5-.33-.85 0-1.7.11-2.5.33C8.82 8.43 7.98 8.7 7.98 8.7c-.41 1.4-.19 2.44-.09 2.69-.73.62-.73 1.52-.73 2.62 0 3.86 2.35 4.72 4.58 4.97-.29.25-.54.69-.63 1.34-.57.26-2.01.69-2.91-.83 0 0-.53-.96-1.53-1.03 0 0-.98-.01-.07.61 0 0 .65.31 1.1 1.46 0 0 .59 1.78 3.36 1.18v1.85c0 .87-.33 1.65-.93 2.2C3.44 21.82 0 17.31 0 12 0 5.37 5.37 0 12 0z"/>
          </svg>
        </div>
      ),
      'Runway ML': (
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <div className="text-white font-bold text-lg">R</div>
        </div>
      ),
      'Notion AI': (
        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
          <div className="text-gray-800 font-bold text-lg">N</div>
        </div>
      ),
      'Claude': (
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
          <div className="text-white font-bold text-lg">C</div>
        </div>
      )
    };
    
    return logoComponents[toolName] || (
      <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
        <div className="text-white font-bold text-lg">?</div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="h-96 w-full relative overflow-hidden rounded-xl bg-gradient-to-br from-black/20 to-gray-900/30 backdrop-blur-sm"
    >
      {/* Minimal background elements */}
      <div className="absolute inset-0">
        {/* Single elegant orbital ring */}
        <div className="absolute top-1/2 left-1/2 w-80 h-80 border border-white/5 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 border border-white/3 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Subtle center glow */}
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-red-500/5 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Clean instructions */}
      <div className="absolute top-6 left-6 text-white/60 z-30">
        <p className="text-sm">Move mouse to explore</p>
      </div>

      {/* Elegant Orbital System */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {visibleTools.map((tool, index) => {
            // Simple, clean orbital calculation
            const angle = (Date.now() * 0.0008 * rotationSpeed + index * 60) % 360;
            const radius = 140 + (index % 2) * 40; // Two orbital rings
            
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const z = Math.sin(angle * Math.PI / 180) * radius;
            
            // Gentle floating motion
            const floatY = Math.sin(Date.now() * 0.001 + index * 2) * 8;
            
            // Clean depth effects
            const scale = 0.9 + (z + radius) / (radius * 4);
            const opacity = 0.7 + (z + radius) / (radius * 2);
            
            return (
              <div
                key={tool.id}
                className={`absolute transition-all duration-300 cursor-pointer ${
                  highlightedTool === index ? 'z-30' : 'z-20'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `
                    translate(-50%, -50%) 
                    translateX(${x}px) 
                    translateY(${floatY}px) 
                    scale(${scale})
                  `,
                  opacity: Math.max(0.6, Math.min(1, opacity)),
                }}
                onMouseEnter={() => setHighlightedTool(index)}
                onMouseLeave={() => setHighlightedTool(null)}
                onClick={() => onToolClick?.(tool)}
              >
                {/* Clean, minimal card design */}
                <div className={`relative w-40 h-48 p-4 rounded-2xl backdrop-blur-md border transition-all duration-500 ${
                  highlightedTool === index 
                    ? 'bg-white/10 border-white/30 shadow-2xl shadow-red-500/20 scale-110' 
                    : 'bg-black/20 border-white/10 hover:bg-black/30 hover:border-white/20'
                }`}>
                  
                  {/* Tool Logo */}
                  <div className={`mb-3 flex justify-center transition-transform duration-300 ${
                    highlightedTool === index ? 'scale-110' : ''
                  }`}>
                    {getToolLogo(tool.name)}
                  </div>
                  
                  {/* Tool Name */}
                  <h3 className={`font-semibold text-sm mb-2 text-center transition-colors duration-300 ${
                    highlightedTool === index ? 'text-white' : 'text-white/90'
                  }`}>
                    {tool.name}
                  </h3>
                  
                  {/* Category */}
                  <p className="text-xs mb-3 text-center text-white/60">
                    {tool.category}
                  </p>
                  
                  {/* Pricing Badge */}
                  <div className="text-center mb-3">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium transition-transform duration-300 ${
                      tool.pricing.type === 'free' 
                        ? 'bg-green-500/80 text-white' :
                      tool.pricing.type === 'freemium' 
                        ? 'bg-blue-500/80 text-white' :
                        'bg-orange-500/80 text-white'
                    } ${highlightedTool === index ? 'scale-105' : ''}`}>
                      {tool.pricing.type === 'free' ? 'FREE' : 
                       tool.pricing.type === 'freemium' ? 'FREEMIUM' :
                       `$${tool.pricing.startingPrice}/mo`}
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 text-xs text-yellow-400">
                    <span>★</span>
                    <span className="text-white/80">{tool.rating}</span>
                  </div>
                  
                  {/* Clean highlight effect */}
                  {highlightedTool === index && (
                    <div className="absolute inset-0 border border-white/20 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clean reference bar */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex gap-2 justify-center">
          {visibleTools.map((tool, index) => (
            <div
              key={`ref-${tool.id}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                highlightedTool === index
                  ? 'bg-white scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              onMouseEnter={() => setHighlightedTool(index)}
              onMouseLeave={() => setHighlightedTool(null)}
              onClick={() => onToolClick?.(tool)}
            />
          ))}
        </div>
      </div>

      {/* Minimal atmospheric overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/10" />
        
        {/* Subtle mouse-following light */}
        <div 
          className="absolute w-64 h-64 rounded-full bg-white/5 blur-3xl transition-all duration-1000"
          style={{
            left: `${50 + mousePosition.x * 20}%`,
            top: `${50 + mousePosition.y * 20}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
};

export default ToolCards3D;
