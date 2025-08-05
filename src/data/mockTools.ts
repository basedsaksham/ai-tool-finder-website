import { AITool } from "@/types/tool";

export const mockTools: AITool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "Advanced conversational AI that can assist with writing, analysis, coding, math, and more.",
    shortDescription: "Powerful conversational AI for text generation and analysis",
    category: "Text & Writing",
    subcategory: "Conversational AI",
    website: "https://chat.openai.com",
    pricing: {
      type: "freemium",
      startingPrice: 20,
      currency: "USD",
      billingPeriod: "monthly"
    },
    features: [
      "Natural language conversations",
      "Code generation and debugging",
      "Text analysis and summarization",
      "Creative writing assistance",
      "Math problem solving"
    ],
    platforms: ["web", "mobile", "api"],
    rating: 4.8,
    reviewCount: 12547,
    pros: [
      "Excellent natural language understanding",
      "Versatile across many tasks",
      "Regular updates and improvements"
    ],
    cons: [
      "Can make factual errors",
      "Limited real-time information",
      "Usage limits on free tier"
    ],
    useCases: [
      "Content creation",
      "Code assistance",
      "Research and analysis",
      "Customer support",
      "Educational tutoring"
    ],
    tags: ["AI", "Text", "Conversation", "OpenAI", "GPT"],
    isPopular: true,
    isTrending: true
  },
  {
    id: "midjourney",
    name: "MidJourney",
    description: "AI-powered image generation tool that creates stunning artwork from text descriptions.",
    shortDescription: "Create beautiful AI-generated images from text prompts",
    category: "Image & Design",
    subcategory: "Image Generation",
    website: "https://midjourney.com",
    pricing: {
      type: "paid",
      startingPrice: 10,
      currency: "USD",
      billingPeriod: "monthly"
    },
    features: [
      "Text-to-image generation",
      "Multiple art styles",
      "High-resolution outputs",
      "Style variations",
      "Community gallery"
    ],
    platforms: ["web"],
    rating: 4.7,
    reviewCount: 8934,
    pros: [
      "Exceptional image quality",
      "Artistic and creative outputs",
      "Active community",
      "Regular style updates"
    ],
    cons: [
      "Requires Discord for access",
      "No free tier",
      "Can be slow during peak times"
    ],
    useCases: [
      "Digital art creation",
      "Concept visualization",
      "Marketing materials",
      "Book illustrations",
      "Social media content"
    ],
    tags: ["AI", "Image", "Art", "Design", "Creative"],
    isPopular: true
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "AI-powered code completion tool that helps developers write code faster and more efficiently.",
    shortDescription: "AI coding assistant that suggests code as you type",
    category: "Development",
    subcategory: "Code Assistance",
    website: "https://github.com/features/copilot",
    pricing: {
      type: "paid",
      startingPrice: 10,
      currency: "USD",
      billingPeriod: "monthly"
    },
    features: [
      "Code autocompletion",
      "Function generation",
      "Multi-language support",
      "Context-aware suggestions",
      "IDE integration"
    ],
    platforms: ["desktop", "web"],
    rating: 4.5,
    reviewCount: 5672,
    pros: [
      "Significantly speeds up coding",
      "Supports many programming languages",
      "Integrates well with popular IDEs"
    ],
    cons: [
      "Requires subscription",
      "Sometimes suggests incorrect code",
      "Privacy concerns with code analysis"
    ],
    useCases: [
      "Software development",
      "Code learning",
      "API integration",
      "Bug fixing",
      "Documentation writing"
    ],
    tags: ["AI", "Code", "Development", "GitHub", "Programming"],
    isPopular: true
  },
  {
    id: "runway-ml",
    name: "Runway ML",
    description: "Comprehensive AI creative suite for video editing, image generation, and multimedia content creation.",
    shortDescription: "AI-powered creative tools for video and image editing",
    category: "Video & Media",
    subcategory: "Video Editing",
    website: "https://runwayml.com",
    pricing: {
      type: "freemium",
      startingPrice: 15,
      currency: "USD",
      billingPeriod: "monthly"
    },
    features: [
      "AI video generation",
      "Background removal",
      "Object tracking",
      "Style transfer",
      "Green screen replacement"
    ],
    platforms: ["web", "desktop"],
    rating: 4.6,
    reviewCount: 3421,
    pros: [
      "Professional-grade video tools",
      "User-friendly interface",
      "Cutting-edge AI features"
    ],
    cons: [
      "Can be expensive for heavy usage",
      "Learning curve for advanced features",
      "Processing can be slow"
    ],
    useCases: [
      "Video content creation",
      "Film post-production",
      "Social media videos",
      "Marketing content",
      "Creative experimentation"
    ],
    tags: ["AI", "Video", "Editing", "Creative", "Media"],
    isTrending: true
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    description: "Integrated AI writing assistant within Notion that helps with content creation, summarization, and organization.",
    shortDescription: "AI writing assistant built into Notion workspace",
    category: "Productivity",
    subcategory: "Writing Assistant",
    website: "https://notion.so/ai",
    pricing: {
      type: "freemium",
      startingPrice: 8,
      currency: "USD",
      billingPeriod: "monthly"
    },
    features: [
      "AI-powered writing",
      "Content summarization",
      "Language translation",
      "Idea brainstorming",
      "Database automation"
    ],
    platforms: ["web", "mobile", "desktop"],
    rating: 4.4,
    reviewCount: 2156,
    pros: [
      "Seamlessly integrated with Notion",
      "Great for productivity workflows",
      "Multiple AI capabilities in one place"
    ],
    cons: [
      "Requires Notion subscription",
      "Limited compared to dedicated AI tools",
      "Can be distracting in workflow"
    ],
    useCases: [
      "Note-taking enhancement",
      "Project documentation",
      "Meeting summaries",
      "Content planning",
      "Knowledge management"
    ],
    tags: ["AI", "Productivity", "Writing", "Notion", "Organization"]
  },
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic's AI assistant designed to be helpful, harmless, and honest with strong analytical capabilities.",
    shortDescription: "Constitutional AI assistant focused on safety and helpfulness",
    category: "Text & Writing",
    subcategory: "Conversational AI",
    website: "https://claude.ai",
    pricing: {
      type: "freemium",
      startingPrice: 20,
      currency: "USD",
      billingPeriod: "monthly"
    },
    features: [
      "Long-form conversations",
      "Document analysis",
      "Code review and generation",
      "Research assistance",
      "Constitutional AI safety"
    ],
    platforms: ["web", "api"],
    rating: 4.6,
    reviewCount: 1847,
    pros: [
      "Excellent for complex analysis",
      "Strong safety features",
      "Great for long documents"
    ],
    cons: [
      "Less creative than some alternatives",
      "Limited availability",
      "Slower response times"
    ],
    useCases: [
      "Research analysis",
      "Document review",
      "Academic writing",
      "Code review",
      "Legal document analysis"
    ],
    tags: ["AI", "Text", "Analysis", "Anthropic", "Safety"],
    isTrending: true
  }
];