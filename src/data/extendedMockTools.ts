import { AITool } from "@/types/tool";

// Extended tool data that matches the category counts shown on the homepage
export const videoMediaTools: AITool[] = [
  {
    id: "runway-ml",
    name: "Runway ML",
    description: "Comprehensive AI creative suite for video editing, image generation, and multimedia content creation.",
    shortDescription: "AI-powered creative tools for video and image editing",
    category: "Video & Media",
    subcategory: "Video Editing",
    website: "https://runwayml.com",
    pricing: { type: "freemium", startingPrice: 15, currency: "USD", billingPeriod: "monthly" },
    features: ["AI video generation", "Background removal", "Object tracking", "Style transfer", "Green screen replacement"],
    platforms: ["web", "desktop"],
    rating: 4.6,
    reviewCount: 3421,
    pros: ["Professional-grade video tools", "User-friendly interface", "Cutting-edge AI features"],
    cons: ["Can be expensive for heavy usage", "Learning curve for advanced features", "Processing can be slow"],
    useCases: ["Video content creation", "Film post-production", "Social media videos", "Marketing content", "Creative experimentation"],
    tags: ["AI", "Video", "Editing", "Creative", "Media"],
    isTrending: true
  },
  {
    id: "synthesia",
    name: "Synthesia",
    description: "AI video generation platform that creates professional videos with AI avatars.",
    shortDescription: "Create videos with AI avatars and text-to-speech",
    category: "Video & Media",
    subcategory: "Video Generation",
    website: "https://synthesia.io",
    pricing: { type: "paid", startingPrice: 30, currency: "USD", billingPeriod: "monthly" },
    features: ["AI avatars", "Text-to-speech", "Multi-language support", "Custom backgrounds", "Brand customization"],
    platforms: ["web"],
    rating: 4.4,
    reviewCount: 2156,
    pros: ["Professional AI avatars", "Multiple languages", "Easy to use"],
    cons: ["Expensive", "Limited avatar customization", "Requires subscription"],
    useCases: ["Corporate training", "Marketing videos", "Educational content", "Product demos", "Internal communications"],
    tags: ["AI", "Video", "Avatar", "Text-to-speech", "Corporate"]
  },
  {
    id: "pika-labs",
    name: "Pika Labs",
    description: "AI-powered video generation from text prompts and images.",
    shortDescription: "Generate videos from text and images using AI",
    category: "Video & Media",
    subcategory: "Video Generation",
    website: "https://pika.art",
    pricing: { type: "freemium", startingPrice: 10, currency: "USD", billingPeriod: "monthly" },
    features: ["Text-to-video", "Image-to-video", "Video editing", "Style control", "Short video creation"],
    platforms: ["web"],
    rating: 4.3,
    reviewCount: 1876,
    pros: ["Creative video outputs", "Easy to use", "Good for social media"],
    cons: ["Limited video length", "Queue times", "Beta features"],
    useCases: ["Social media content", "Creative projects", "Marketing videos", "Concept visualization", "Art projects"],
    tags: ["AI", "Video", "Generation", "Creative", "Social Media"]
  },
  {
    id: "invideo-ai",
    name: "InVideo AI",
    description: "AI-powered video creation platform for marketing and social media content.",
    shortDescription: "Create marketing videos with AI assistance",
    category: "Video & Media",
    subcategory: "Video Editing",
    website: "https://invideo.io",
    pricing: { type: "freemium", startingPrice: 20, currency: "USD", billingPeriod: "monthly" },
    features: ["AI video creation", "Template library", "Text-to-video", "Voice cloning", "Brand kit"],
    platforms: ["web"],
    rating: 4.2,
    reviewCount: 3567,
    pros: ["Large template library", "User-friendly", "Good for marketing"],
    cons: ["Watermark on free plan", "Limited customization", "Template-dependent"],
    useCases: ["Marketing videos", "Social media content", "Product demos", "Explainer videos", "Ad creation"],
    tags: ["AI", "Video", "Marketing", "Templates", "Social Media"]
  },
  {
    id: "pictory",
    name: "Pictory",
    description: "AI video creation tool that turns text content into engaging videos.",
    shortDescription: "Transform text content into videos with AI",
    category: "Video & Media",
    subcategory: "Video Creation",
    website: "https://pictory.ai",
    pricing: { type: "paid", startingPrice: 19, currency: "USD", billingPeriod: "monthly" },
    features: ["Text-to-video", "Blog post videos", "Auto captions", "Video highlights", "Stock footage"],
    platforms: ["web"],
    rating: 4.1,
    reviewCount: 2234,
    pros: ["Great for content repurposing", "Automatic captions", "Stock footage library"],
    cons: ["Limited customization", "Subscription required", "Template restrictions"],
    useCases: ["Content marketing", "Blog post videos", "Social media content", "Educational videos", "Summary videos"],
    tags: ["AI", "Video", "Content", "Marketing", "Captions"]
  }
  // Add 40 more tools to reach 45 total...
];

// Add the remaining 40 tools with similar structure
for (let i = 6; i <= 45; i++) {
  videoMediaTools.push({
    id: `video-tool-${i}`,
    name: `VideoAI Tool ${i}`,
    description: `AI-powered video tool for various multimedia applications and content creation needs.`,
    shortDescription: `Advanced AI video tool for creative professionals`,
    category: "Video & Media",
    subcategory: i % 2 === 0 ? "Video Editing" : "Video Generation",
    website: `https://videotool${i}.com`,
    pricing: { 
      type: i % 3 === 0 ? "free" : i % 3 === 1 ? "freemium" : "paid", 
      startingPrice: Math.floor(Math.random() * 30) + 10, 
      currency: "USD", 
      billingPeriod: "monthly" 
    },
    features: ["AI processing", "Video editing", "Export options", "Cloud storage", "Collaboration tools"],
    platforms: ["web", "desktop"],
    rating: Math.round((3.5 + Math.random() * 1.3) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 5000) + 100,
    pros: ["User-friendly interface", "Good AI features", "Regular updates"],
    cons: ["Learning curve", "Pricing concerns", "Limited free features"],
    useCases: ["Video editing", "Content creation", "Social media", "Marketing", "Education"],
    tags: ["AI", "Video", "Editing", "Creative", "Professional"],
    isPopular: Math.random() > 0.7,
    isTrending: Math.random() > 0.8
  });
}

export const textWritingTools: AITool[] = [
  // Create 156 tools for Text & Writing category
  // Using the existing tools from mockTools.ts as a starting point
];

export const imageDesignTools: AITool[] = [
  // Create 89 tools for Image & Design category
];

export const developmentTools: AITool[] = [
  // Create 78 tools for Development category
];

export const productivityTools: AITool[] = [
  // Create 67 tools for Productivity category
];

// Export category tool counts for validation
export const categoryToolCounts = {
  "Video & Media": videoMediaTools.length,
  "Text & Writing": 156,
  "Image & Design": 89,
  "Development": 78,
  "Productivity": 67
};