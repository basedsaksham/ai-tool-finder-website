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
  const [cardPositions, setCardPositions] = useState<Array<{x: number, y: number, rotation: number, scale: number}>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Initialize horizontal row positions
  useEffect(() => {
    const positions = visibleTools.map((_, index) => {
      const spacing = 150; // Horizontal spacing between cards

      return {
        x: (index - 2.5) * spacing, // Center the row horizontally
        y: 0, // All cards in same row
        rotation: 0,
        scale: 1,
      };
    });
    setCardPositions(positions);
  }, [visibleTools.length]);

  // Mouse tracking for subtle character reactions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);

        setMousePosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Get bouncy tool logo components
  const getBouncyToolLogo = (toolName: string) => {
    const logoComponents: { [key: string]: JSX.Element } = {
      'ChatGPT': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-green-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/50 transform group-hover:rotate-12 transition-transform duration-300">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
            </svg>
            {/* Bouncy eyes effect */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-80 group-hover:animate-bounce"></div>
          </div>
        </div>
      ),
      'MidJourney': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 transform group-hover:-rotate-12 transition-transform duration-300">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-200">
              <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-lg group-hover:animate-pulse"></div>
            </div>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-pink-400 rounded-full opacity-80 group-hover:animate-ping"></div>
          </div>
        </div>
      ),
      'GitHub Copilot': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gray-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-gray-700/50 transform group-hover:rotate-6 transition-transform duration-300">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
              <path d="M12 0c6.63 0 12 5.37 12 12 0 5.31-3.44 9.82-8.2 11.4-.6-.55-.93-1.33-.93-2.2v-1.96c0-.67-.23-1.14-.69-1.4 2.24-.25 4.6-1.1 4.6-4.97 0-1.1-.39-2-.73-2.62.1-.25.32-1.29-.09-2.69 0 0-.84-.27-2.75 1.02-.8-.22-1.65-.33-2.5-.33-.85 0-1.7.11-2.5.33C8.82 8.43 7.98 8.7 7.98 8.7c-.41 1.4-.19 2.44-.09 2.69-.73.62-.73 1.52-.73 2.62 0 3.86 2.35 4.72 4.58 4.97-.29.25-.54.69-.63 1.34-.57.26-2.01.69-2.91-.83 0 0-.53-.96-1.53-1.03 0 0-.98-.01-.07.61 0 0 .65.31 1.1 1.46 0 0 .59 1.78 3.36 1.18v1.85c0 .87-.33 1.65-.93 2.2C3.44 21.82 0 17.31 0 12 0 5.37 5.37 0 12 0z"/>
            </svg>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full opacity-80 group-hover:animate-bounce"></div>
          </div>
        </div>
      ),
      'Runway ML': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-400/50 transform group-hover:rotate-12 transition-transform duration-300">
            <div className="text-white font-bold text-3xl drop-shadow-lg group-hover:scale-125 transition-transform duration-200">R</div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-80 group-hover:animate-ping"></div>
          </div>
        </div>
      ),
      'Notion AI': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gray-300 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center shadow-2xl shadow-gray-300/50 transform group-hover:-rotate-6 transition-transform duration-300">
            <div className="text-gray-800 font-bold text-3xl drop-shadow-lg group-hover:scale-125 transition-transform duration-200">N</div>
            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full opacity-80 group-hover:animate-bounce"></div>
          </div>
        </div>
      ),
      'Claude': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-400/50 transform group-hover:rotate-12 transition-transform duration-300">
            <div className="text-white font-bold text-3xl drop-shadow-lg group-hover:scale-125 transition-transform duration-200">C</div>
            <div className="absolute -bottom-1 left-1 w-2 h-2 bg-yellow-400 rounded-full opacity-80 group-hover:animate-ping"></div>
          </div>
        </div>
      )
    };
    
    return logoComponents[toolName] || (
      <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
        <div className="absolute inset-0 bg-gray-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
        <div className="relative w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-gray-500/50">
          <div className="text-white font-bold text-3xl drop-shadow-lg">?</div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="h-96 w-full relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-50/30 via-blue-50/20 to-indigo-50/30 backdrop-blur-sm"
    >
      {/* Chill and soothing background */}
      <div className="absolute inset-0">
        {/* Gentle wave patterns */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`wave-${i}`}
              className="absolute w-full h-full"
              style={{
                background: `linear-gradient(${45 + i * 45}deg, transparent 40%, rgba(59, 130, 246, 0.1) 50%, transparent 60%)`,
                animation: `float ${8 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Floating zen elements */}
        {Array.from({ length: 6 }).map((_, i) => {
          const elements = ['🌊', '🍃', '☁️', '🌸', '🦋', '💙'];
          const positions = [
            { left: 10, top: 20 },
            { left: 90, top: 25 },
            { left: 15, top: 75 },
            { left: 85, top: 80 },
            { left: 25, top: 10 },
            { left: 75, top: 90 },
          ];

          return (
            <div
              key={`zen-${i}`}
              className="absolute text-xl opacity-40 animate-float"
              style={{
                left: `${positions[i].left}%`,
                top: `${positions[i].top}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${6 + i}s`,
              }}
            >
              {elements[i]}
            </div>
          );
        })}

        {/* Soft flowing gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-100/20 via-blue-100/15 to-indigo-100/20 animate-pulse"></div>

        {/* Gentle ripple effects */}
        <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-teal-200/30 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 border border-blue-200/20 rounded-full animate-ping" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      </div>

      {/* Calm instructions */}
      <div className="absolute top-6 left-6 text-teal-700/80 z-30">
        <p className="text-sm font-light">🌊 Hover over the tools to explore</p>
      </div>

      {/* Structured Pixar-style Character Cards */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {visibleTools.map((tool, index) => {
            const position = cardPositions[index] || { x: 0, y: 0, rotation: 0, scale: 1 };

            // Enhanced mouse interaction
            const time = Date.now() * 0.001;
            const breatheY = Math.sin(time * 1.5 + index * 0.8) * 2; // Gentle floating
            const breatheScale = 1 + Math.sin(time * 2 + index * 0.5) * 0.01; // Subtle breathing
            const breatheRotation = Math.sin(time * 0.8 + index * 1.2) * 0.5; // Gentle sway

            // Enhanced mouse reaction - cards follow mouse more responsively
            const mouseInfluence = 40;
            const mouseX = mousePosition.x * mouseInfluence;
            const mouseY = mousePosition.y * mouseInfluence;

            // Distance-based mouse interaction
            const cardCenterX = position.x;
            const cardCenterY = position.y;
            const distanceFromMouse = Math.sqrt(
              Math.pow(mouseX - cardCenterX, 2) + Math.pow(mouseY - cardCenterY, 2)
            );
            const maxDistance = 150;
            const mouseProximity = Math.max(0, 1 - distanceFromMouse / maxDistance);

            // Interactive scaling and rotation based on mouse proximity
            const mouseScale = 1 + mouseProximity * 0.1;
            const mouseRotation = mouseProximity * (mousePosition.x * 10);

            return (
              <div
                key={tool.id}
                className={`absolute transition-all duration-500 cursor-pointer ${
                  highlightedTool === index ? 'z-30' : 'z-20'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `
                    translate(-50%, -50%)
                    translateX(${position.x + mouseX * 0.3}px)
                    translateY(${position.y + breatheY + mouseY * 0.2}px)
                    rotate(${breatheRotation + mouseRotation}deg)
                    scale(${breatheScale * mouseScale})
                  `,
                  transformOrigin: 'center',
                }}
                onMouseEnter={() => setHighlightedTool(index)}
                onMouseLeave={() => setHighlightedTool(null)}
                onClick={() => onToolClick?.(tool)}
              >
                {/* Compact interactive card */}
                <div className={`relative w-36 h-44 p-4 rounded-2xl backdrop-blur-md border-2 transition-all duration-500 transform ${
                  highlightedTool === index
                    ? 'bg-white/50 border-white/60 shadow-xl shadow-white/30 scale-110'
                    : 'bg-white/25 border-white/30 hover:bg-white/35 hover:border-white/50'
                }`}>
                  
                  {/* Compact Tool Logo */}
                  <div className={`mb-2 flex justify-center transition-all duration-500 ${
                    highlightedTool === index ? 'scale-110' : ''
                  }`}>
                    <div className="scale-75">
                      {getBouncyToolLogo(tool.name)}
                    </div>
                  </div>

                  {/* Tool Name */}
                  <h3 className={`font-bold text-sm mb-1 text-center transition-all duration-500 ${
                    highlightedTool === index
                      ? 'text-purple-800 text-base'
                      : 'text-gray-800'
                  }`}>
                    {tool.name}
                  </h3>

                  {/* Category */}
                  <p className={`text-xs mb-2 text-center transition-colors duration-500 ${
                    highlightedTool === index ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {tool.category}
                  </p>

                  {/* Compact Pricing Badge */}
                  <div className="text-center mb-2">
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium transition-all duration-500 ${
                      tool.pricing.type === 'free'
                        ? 'bg-green-400/80 text-white' :
                      tool.pricing.type === 'freemium'
                        ? 'bg-blue-400/80 text-white' :
                        'bg-orange-400/80 text-white'
                    } ${highlightedTool === index ? 'scale-105' : ''}`}>
                      {tool.pricing.type === 'free' ? 'FREE' :
                       tool.pricing.type === 'freemium' ? 'FREEMIUM' :
                       `$${tool.pricing.startingPrice}/mo`}
                    </div>
                  </div>

                  {/* Compact Rating */}
                  <div className={`flex items-center justify-center gap-1 text-xs transition-all duration-500 ${
                    highlightedTool === index ? 'text-yellow-600 scale-105' : 'text-yellow-500'
                  }`}>
                    <span>⭐</span>
                    <span className="text-gray-700 font-medium">{tool.rating}</span>
                  </div>
                  
                  {/* Character expressions */}
                  {highlightedTool === index && (
                    <>
                      {/* Happy face */}
                      <div className="absolute -top-3 -right-3 text-2xl animate-bounce">😊</div>
                      {/* Sparkle trail */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-200/20 to-pink-200/20 animate-pulse"></div>
                      {/* Hearts floating up */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm animate-bounce">💕</div>
                    </>
                  )}
                  
                  {/* Shadow character effect */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-black/20 rounded-full blur-sm animate-pulse"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Playful reference dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex gap-3 justify-center">
          {visibleTools.map((tool, index) => (
            <div
              key={`ref-${tool.id}`}
              className={`relative transition-all duration-500 cursor-pointer transform ${
                highlightedTool === index ? 'scale-150 animate-bounce' : 'hover:scale-125'
              }`}
              onMouseEnter={() => setHighlightedTool(index)}
              onMouseLeave={() => setHighlightedTool(null)}
              onClick={() => onToolClick?.(tool)}
            >
              <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
                highlightedTool === index
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 shadow-lg shadow-purple-400/50'
                  : 'bg-gray-400/60 hover:bg-gray-400/80'
              }`} />
              {highlightedTool === index && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 whitespace-nowrap font-bold animate-bounce">
                  {tool.name} 🎉
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Magical atmosphere overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent"></div>
        
        {/* Mouse-following magical dust */}
        <div 
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-pink-200/20 to-purple-200/20 blur-3xl transition-all duration-1000"
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
