import { useState, useMemo, useRef, useEffect } from 'react';
import { AITool } from '@/types/tool';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ToolCards3DProps {
  tools: AITool[];
  onToolClick?: (tool: AITool) => void;
}

const ToolCards3D = ({ tools, onToolClick }: ToolCards3DProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [highlightedTool, setHighlightedTool] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardPositions, setCardPositions] = useState<Array<{x: number, y: number, rotation: number, scale: number}>>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Organize tools into slides of 6
  const toolsPerSlide = 6;
  const totalSlides = Math.ceil(tools.length / toolsPerSlide);
  const slides = useMemo(() => {
    const slideArray = [];
    for (let i = 0; i < totalSlides; i++) {
      slideArray.push(tools.slice(i * toolsPerSlide, (i + 1) * toolsPerSlide));
    }
    return slideArray;
  }, [tools, totalSlides, toolsPerSlide]);

  const currentSlideTools = slides[currentSlide] || [];

  // Slide animations - different animation for each slide
  const slideAnimations = [
    'slide-from-right', // Slide 1: Cards slide in from right
    'slide-from-left',  // Slide 2: Cards slide in from left  
    'slide-from-bottom', // Slide 3: Cards slide in from bottom
    'slide-from-top',   // Slide 4: Cards slide in from top
    'fade-in-scale',    // Slide 5: Cards fade in with scale
    'rotate-in',        // Slide 6: Cards rotate in
  ];

  const getCurrentAnimation = () => slideAnimations[currentSlide % slideAnimations.length];

  // Official AI tool logos with consistent styling
  const getOfficialToolLogo = (toolName: string) => {
    const logoComponents: { [key: string]: JSX.Element } = {
      'ChatGPT': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-green-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/50">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
            </svg>
          </div>
        </div>
      ),
      'Claude': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-400/50">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
      ),
      'Google Gemini': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>
      ),
      'MidJourney': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner">
              <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg"></div>
            </div>
          </div>
        </div>
      ),
      'DALL-E 3': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-green-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-teal-400 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-400/50">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
        </div>
      ),
      'Stable Diffusion': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50">
            <div className="text-white font-bold text-2xl">SD</div>
          </div>
        </div>
      ),
      'GitHub Copilot': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gray-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-gray-700/50">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
              <path d="M12 0c6.63 0 12 5.37 12 12 0 5.31-3.44 9.82-8.2 11.4-.6-.55-.93-1.33-.93-2.2v-1.96c0-.67-.23-1.14-.69-1.4 2.24-.25 4.6-1.1 4.6-4.97 0-1.1-.39-2-.73-2.62.1-.25.32-1.29-.09-2.69 0 0-.84-.27-2.75 1.02-.8-.22-1.65-.33-2.5-.33-.85 0-1.7.11-2.5.33C8.82 8.43 7.98 8.7 7.98 8.7c-.41 1.4-.19 2.44-.09 2.69-.73.62-.73 1.52-.73 2.62 0 3.86 2.35 4.72 4.58 4.97-.29.25-.54.69-.63 1.34-.57.26-2.01.69-2.91-.83 0 0-.53-.96-1.53-1.03 0 0-.98-.01-.07.61 0 0 .65.31 1.1 1.46 0 0 .59 1.78 3.36 1.18v1.85c0 .87-.33 1.65-.93 2.2C3.44 21.82 0 17.31 0 12 0 5.37 5.37 0 12 0z"/>
            </svg>
          </div>
        </div>
      ),
      'Runway ML': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-400/50">
            <div className="text-white font-bold text-3xl">R</div>
          </div>
        </div>
      ),
      'Notion AI': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gray-300 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center shadow-2xl shadow-gray-300/50">
            <div className="text-gray-800 font-bold text-3xl">N</div>
          </div>
        </div>
      ),
      'Grammarly': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/50">
            <div className="text-white font-bold text-3xl">G</div>
          </div>
        </div>
      ),
      'Perplexity AI': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-600/50">
            <div className="text-white font-bold text-2xl">⊥</div>
          </div>
        </div>
      ),
      'Cursor': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/50">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
              <path d="M8.11 4.03L12 7.93L15.89 4.03L18 6.14L14.11 10.04L18 13.94L15.89 16.05L12 12.15L8.11 16.05L6 13.94L9.89 10.04L6 6.14L8.11 4.03Z"/>
            </svg>
          </div>
        </div>
      ),
      'Synthesia': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      ),
      'Otter.ai': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
            <div className="text-white font-bold text-2xl">🦦</div>
          </div>
        </div>
      ),
      'Mubert': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/50">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        </div>
      ),
      'HubSpot AI': (
        <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/50">
            <div className="text-white font-bold text-3xl">H</div>
          </div>
        </div>
      )
    };
    
    return logoComponents[toolName] || (
      <div className="relative w-16 h-16 group transform transition-all duration-300 hover:scale-110">
        <div className="absolute inset-0 bg-gray-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
        <div className="relative w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-gray-500/50">
          <div className="text-white font-bold text-2xl">{toolName.charAt(0)}</div>
        </div>
      </div>
    );
  };

  // Initialize positions for current slide
  useEffect(() => {
    const positions = currentSlideTools.map((_, index) => {
      const spacing = 150;
      return {
        x: (index - (currentSlideTools.length - 1) / 2) * spacing,
        y: 0,
        rotation: 0,
        scale: 1,
      };
    });
    setCardPositions(positions);
  }, [currentSlideTools]);

  // Mouse tracking
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

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < totalSlides - 1) {
      nextSlide();
    }
    if (isRightSwipe && currentSlide > 0) {
      prevSlide();
    }
  };

  // Navigation functions
  const nextSlide = () => {
    if (currentSlide < totalSlides - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const goToSlide = (slideIndex: number) => {
    if (slideIndex !== currentSlide && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(slideIndex);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-96 w-full relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-50/30 via-blue-50/20 to-indigo-50/30 backdrop-blur-sm"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Enhanced background with slide-specific gradients */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 transition-all duration-1000 ${
          currentSlide % 2 === 0 
            ? 'bg-gradient-to-br from-teal-100/30 via-blue-100/20 to-indigo-100/30'
            : 'bg-gradient-to-br from-purple-100/30 via-pink-100/20 to-orange-100/30'
        }`}></div>
        
        {/* Floating elements that change per slide */}
        {Array.from({ length: 6 }).map((_, i) => {
          const elements = currentSlide % 2 === 0 
            ? ['🌊', '🍃', '☁️', '🌸', '🦋', '💙']
            : ['✨', '🚀', '💫', '🌟', '⚡', '🔮'];
          const positions = [
            { left: 10, top: 20 }, { left: 90, top: 25 }, { left: 15, top: 75 },
            { left: 85, top: 80 }, { left: 25, top: 10 }, { left: 75, top: 90 },
          ];
          return (
            <div
              key={`element-${currentSlide}-${i}`}
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
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        disabled={currentSlide === 0 || isTransitioning}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-40 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 ${
          currentSlide === 0 || isTransitioning
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-white hover:scale-110 hover:shadow-xl'
        }`}
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <button
        onClick={nextSlide}
        disabled={currentSlide === totalSlides - 1 || isTransitioning}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-40 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 ${
          currentSlide === totalSlides - 1 || isTransitioning
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-white hover:scale-110 hover:shadow-xl'
        }`}
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Slide indicator and info */}
      <div className="absolute top-6 left-6 text-teal-700/80 z-30">
        <p className="text-sm font-light">
          🌊 Slide {currentSlide + 1} of {totalSlides} • {currentSlideTools.length} tools
        </p>
      </div>

      {/* 3D Cards with slide-specific animations */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {currentSlideTools.map((tool, index) => {
            const position = cardPositions[index] || { x: 0, y: 0, rotation: 0, scale: 1 };
            const time = Date.now() * 0.001;
            
            // Different breathing patterns per slide
            const breatheY = Math.sin(time * (1.5 + currentSlide * 0.2) + index * 0.8) * 2;
            const breatheScale = 1 + Math.sin(time * (2 + currentSlide * 0.1) + index * 0.5) * 0.01;
            const breatheRotation = Math.sin(time * (0.8 + currentSlide * 0.1) + index * 1.2) * 0.5;

            // Enhanced mouse interaction
            const mouseInfluence = 40;
            const mouseX = mousePosition.x * mouseInfluence;
            const mouseY = mousePosition.y * mouseInfluence;

            // Distance-based interaction
            const distanceFromMouse = Math.sqrt(
              Math.pow(mouseX - position.x, 2) + Math.pow(mouseY - position.y, 2)
            );
            const maxDistance = 150;
            const mouseProximity = Math.max(0, 1 - distanceFromMouse / maxDistance);
            const mouseScale = 1 + mouseProximity * 0.1;
            const mouseRotation = mouseProximity * (mousePosition.x * 10);

            return (
              <div
                key={`${currentSlide}-${tool.id}`}
                className={`absolute transition-all duration-500 cursor-pointer ${
                  highlightedTool === index ? 'z-30' : 'z-20'
                } ${getCurrentAnimation()}`}
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
                  animationDelay: `${index * 0.1}s`,
                }}
                onMouseEnter={() => setHighlightedTool(index)}
                onMouseLeave={() => setHighlightedTool(null)}
                onClick={() => onToolClick?.(tool)}
              >
                {/* Consistent card structure */}
                <div className={`relative w-36 h-44 p-4 rounded-2xl backdrop-blur-md border-2 transition-all duration-500 transform ${
                  highlightedTool === index
                    ? 'bg-white/50 border-white/60 shadow-xl shadow-white/30 scale-110'
                    : 'bg-white/25 border-white/30 hover:bg-white/35 hover:border-white/50'
                }`}>
                  
                  {/* Official Tool Logo */}
                  <div className={`mb-2 flex justify-center transition-all duration-500 ${
                    highlightedTool === index ? 'scale-110' : ''
                  }`}>
                    <div className="scale-75">
                      {getOfficialToolLogo(tool.name)}
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

                  {/* Pricing Badge */}
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
                       tool.pricing.type === 'enterprise' ? 'ENTERPRISE' :
                       `$${tool.pricing.startingPrice}/mo`}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className={`flex items-center justify-center gap-1 text-xs transition-all duration-500 ${
                    highlightedTool === index ? 'text-yellow-600 scale-105' : 'text-yellow-500'
                  }`}>
                    <span>⭐</span>
                    <span className="text-gray-700 font-medium">{tool.rating}</span>
                  </div>
                  
                  {/* Hover effects */}
                  {highlightedTool === index && (
                    <>
                      <div className="absolute -top-3 -right-3 text-2xl animate-bounce">😊</div>
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-200/20 to-pink-200/20 animate-pulse"></div>
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm animate-bounce">💕</div>
                    </>
                  )}
                  
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-black/20 rounded-full blur-sm animate-pulse"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex gap-3 justify-center">
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === slideIndex
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 shadow-lg shadow-purple-400/50 scale-150'
                  : 'bg-gray-400/60 hover:bg-gray-400/80 hover:scale-125'
              }`}
            >
              {currentSlide === slideIndex && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 whitespace-nowrap font-bold">
                  Slide {slideIndex + 1}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gray-300/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 ease-out"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ToolCards3D;
