import { useState, useMemo } from 'react';
import { AITool } from '@/types/tool';

interface ToolCards3DProps {
  tools: AITool[];
  onToolClick?: (tool: AITool) => void;
}

const ToolCards3D = ({ tools, onToolClick }: ToolCards3DProps) => {
  const visibleTools = tools.slice(0, 6);
  const [highlightedTool, setHighlightedTool] = useState<number | null>(null);

  // Get tool logo component
  const getToolLogo = (toolName: string) => {
    const logoComponents: { [key: string]: JSX.Element } = {
      'ChatGPT': (
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
          </svg>
        </div>
      ),
      'MidJourney': (
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg"></div>
          </div>
        </div>
      ),
      'GitHub Copilot': (
        <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-700/30">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
            <path d="M12 0c6.63 0 12 5.37 12 12 0 5.31-3.44 9.82-8.2 11.4-.6-.55-.93-1.33-.93-2.2v-1.96c0-.67-.23-1.14-.69-1.4 2.24-.25 4.6-1.1 4.6-4.97 0-1.1-.39-2-.73-2.62.1-.25.32-1.29-.09-2.69 0 0-.84-.27-2.75 1.02-.8-.22-1.65-.33-2.5-.33-.85 0-1.7.11-2.5.33C8.82 8.43 7.98 8.7 7.98 8.7c-.41 1.4-.19 2.44-.09 2.69-.73.62-.73 1.52-.73 2.62 0 3.86 2.35 4.72 4.58 4.97-.29.25-.54.69-.63 1.34-.57.26-2.01.69-2.91-.83 0 0-.53-.96-1.53-1.03 0 0-.98-.01-.07.61 0 0 .65.31 1.1 1.46 0 0 .59 1.78 3.36 1.18v1.85c0 .87-.33 1.65-.93 2.2C3.44 21.82 0 17.31 0 12 0 5.37 5.37 0 12 0z"/>
          </svg>
        </div>
      ),
      'Runway ML': (
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-400/30">
          <div className="text-white font-bold text-2xl">R</div>
        </div>
      ),
      'Notion AI': (
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-300/30">
          <div className="text-gray-800 font-bold text-2xl">N</div>
        </div>
      ),
      'Claude': (
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-400/30">
          <div className="text-white font-bold text-2xl">C</div>
        </div>
      )
    };
    
    return logoComponents[toolName] || (
      <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
        <div className="text-white font-bold text-2xl">?</div>
      </div>
    );
  };

  return (
    <div className="h-96 w-full relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        {/* Floating orbs */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-red-500 to-purple-500 rounded-full animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute top-6 left-6 text-white/80 z-30">
        <p className="text-sm font-medium">✨ Hover to explore tools</p>
      </div>

      {/* Animated Tool Cards */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl">
          {visibleTools.map((tool, index) => {
            // Arrange cards in a dynamic grid pattern
            const positions = [
              { x: '20%', y: '25%' },  // Top left
              { x: '50%', y: '20%' },  // Top center
              { x: '80%', y: '30%' },  // Top right
              { x: '25%', y: '70%' },  // Bottom left
              { x: '50%', y: '75%' },  // Bottom center
              { x: '75%', y: '65%' },  // Bottom right
            ];

            const position = positions[index] || { x: '50%', y: '50%' };

            return (
              <div
                key={tool.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-pointer ${
                  highlightedTool === index ? 'z-30' : 'z-20'
                }`}
                style={{
                  left: position.x,
                  top: position.y,
                  animationDelay: `${index * 0.2}s`,
                }}
                onMouseEnter={() => setHighlightedTool(index)}
                onMouseLeave={() => setHighlightedTool(null)}
                onClick={() => onToolClick?.(tool)}
              >
                {/* Main Card */}
                <div className={`relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-500 animate-fade-in ${
                  highlightedTool === index 
                    ? 'bg-red-500/30 border-red-500/60 shadow-2xl shadow-red-500/40 scale-110 -rotate-2' 
                    : 'bg-black/40 border-white/20 hover:bg-black/60 hover:border-white/40 hover:scale-105'
                }`}>
                  
                  {/* Tool Logo with bounce animation */}
                  <div className={`mb-4 transition-all duration-300 ${
                    highlightedTool === index ? 'animate-bounce' : 'hover:scale-110'
                  }`}>
                    {getToolLogo(tool.name)}
                  </div>
                  
                  {/* Tool Name */}
                  <h3 className={`font-bold text-lg mb-2 transition-all duration-300 text-center ${
                    highlightedTool === index 
                      ? 'text-red-200 text-xl' 
                      : 'text-white'
                  }`}>
                    {tool.name}
                  </h3>
                  
                  {/* Category */}
                  <p className={`text-sm mb-3 text-center transition-colors duration-300 ${
                    highlightedTool === index ? 'text-red-300' : 'text-white/70'
                  }`}>
                    {tool.category}
                  </p>
                  
                  {/* Pricing Badge */}
                  <div className={`text-center mb-3`}>
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                      tool.pricing.type === 'free' 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/40' :
                      tool.pricing.type === 'freemium' 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' :
                        'bg-orange-500 text-white shadow-lg shadow-orange-500/40'
                    } ${highlightedTool === index ? 'scale-110 animate-pulse' : ''}`}>
                      {tool.pricing.type === 'free' ? 'FREE' : 
                       tool.pricing.type === 'freemium' ? 'FREEMIUM' :
                       `$${tool.pricing.startingPrice}/mo`}
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className={`flex items-center justify-center gap-2 transition-all duration-300 ${
                    highlightedTool === index ? 'text-yellow-300 scale-110' : 'text-yellow-400'
                  }`}>
                    <span className="text-yellow-400 text-lg">★</span>
                    <span className="text-white font-semibold">{tool.rating}</span>
                  </div>
                  
                  {/* Glow effect for highlighted card */}
                  {highlightedTool === index && (
                    <div className="absolute inset-0 border-2 border-red-500/60 rounded-2xl bg-red-500/10 backdrop-blur-sm animate-pulse -z-10" />
                  )}
                  
                  {/* Floating particles for highlighted card */}
                  {highlightedTool === index && (
                    <>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-red-400 rounded-full animate-ping opacity-60"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom tool reference bar */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex gap-2 flex-wrap justify-center max-w-lg">
          {visibleTools.map((tool, index) => (
            <span
              key={`ref-${tool.id}`}
              className={`text-xs px-3 py-2 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-sm ${
                highlightedTool === index
                  ? 'bg-red-500/50 text-white border border-red-500/60 scale-110'
                  : 'bg-black/50 text-white/70 border border-white/20 hover:bg-white/20'
              }`}
              onMouseEnter={() => setHighlightedTool(index)}
              onMouseLeave={() => setHighlightedTool(null)}
              onClick={() => onToolClick?.(tool)}
            >
              {tool.name}
            </span>
          ))}
        </div>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default ToolCards3D;
