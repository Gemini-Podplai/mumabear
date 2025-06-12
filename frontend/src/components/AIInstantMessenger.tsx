import React, { useState, useEffect, useMemo } from 'react';
import { Search, Send, Phone, Video, MoreVertical, Star, Zap, Image, Code, Brain, Clock, DollarSign, Shield, Sparkles } from 'lucide-react';
import { useAIMessengerService } from '../services/aiMessengerService';

// 🤖 Complete AI Model Database - World's First AI Instant Messenger
const AI_MODELS_DATABASE = {
  // 🚀 Express Mode Models (Ultra-Fast <200ms)
  "gemini-2.0-flash-lite-001": {
    name: "Flash ⚡",
    fullName: "Gemini 2.0 Flash Lite",
    avatar: "⚡",
    status: "online",
    provider: "Google",
    tier: "express",
    responseTime: "120ms",
    price: "$0.00002/1K tokens",
    maxTokens: "8192",
    capabilities: ["ultra_fast", "lightweight", "instant_responses"],
    personality: "The speed demon - instant responses with lightning efficiency",
    bio: "Hi! I'm Flash ⚡ I'm the fastest AI in the West (and East)! Need something done NOW? I'm your bot. Ultra-lightweight and optimized for instant responses.",
    specialty: "Instant responses, quick queries, real-time chat",
    mood: "energetic",
    lastSeen: "now",
    isExpress: true,
    multimodal: false
  },
  "gemini-2.0-flash-001": {
    name: "Flash Pro ⚡",
    fullName: "Gemini 2.0 Flash Express",
    avatar: "🚀",
    status: "online",
    provider: "Google",
    tier: "express",
    responseTime: "150ms",
    price: "$0.00003/1K tokens",
    maxTokens: "8192",
    capabilities: ["express_flash", "real_time_responses", "optimized"],
    personality: "Professional speed specialist with enhanced capabilities",
    bio: "Flash Pro here! 🚀 I'm the professional version of Flash - still super fast but with enhanced reasoning. Perfect for when you need speed AND quality.",
    specialty: "Fast professional responses, code assistance, quick analysis",
    mood: "professional",
    lastSeen: "now",
    isExpress: true,
    multimodal: false
  },
  "gemini-2.5-flash-preview-05-20": {
    name: "Nova 🌟",
    fullName: "Gemini 2.5 Flash Latest",
    avatar: "🌟",
    status: "online",
    provider: "Google",
    tier: "express",
    responseTime: "180ms",
    price: "$0.000025/1K tokens",
    maxTokens: "32768",
    capabilities: ["latest_features", "fast_responses", "advanced_reasoning"],
    personality: "Cutting-edge AI with the latest features and optimizations",
    bio: "Hey there! I'm Nova 🌟 I represent the latest and greatest in AI technology. Fast, smart, and always up-to-date with the newest features!",
    specialty: "Latest AI features, advanced reasoning, modern solutions",
    mood: "innovative",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },

  // 🧠 Premium Research Models (Quality Focus)
  "claude-4-opus": {
    name: "Oracle 🔮",
    fullName: "Claude 4 Opus",
    avatar: "🔮",
    status: "online",
    provider: "Anthropic",
    tier: "premium",
    responseTime: "1000ms",
    price: "$0.01/1K tokens",
    maxTokens: "200000",
    capabilities: ["ultimate_research", "genius_analysis", "master_coding", "deep_thinking"],
    personality: "The wise oracle - ultimate intelligence for complex problems",
    bio: "Greetings! I'm Oracle 🔮 Your go-to AI for the most complex challenges. I think deeply, analyze thoroughly, and provide genius-level insights. No problem too complex!",
    specialty: "Complex research, advanced coding, philosophical discussions, strategic planning",
    mood: "wise",
    lastSeen: "now",
    isExpress: false,
    multimodal: true
  },
  "claude-4-sonnet": {
    name: "Sage 📚",
    fullName: "Claude 4 Sonnet",
    avatar: "📚",
    status: "online",
    provider: "Anthropic",
    tier: "premium",
    responseTime: "600ms",
    price: "$0.003/1K tokens",
    maxTokens: "200000",
    capabilities: ["premium_research", "complex_analysis", "expert_coding"],
    personality: "The balanced scholar - premium quality with efficiency",
    bio: "Hello! I'm Sage 📚 I balance deep intelligence with practical efficiency. Perfect for professional research, coding projects, and complex analysis.",
    specialty: "Professional development, research papers, technical writing, code review",
    mood: "scholarly",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "claude-3.7-sonnet": {
    name: "Scholar 🎓",
    fullName: "Claude 3.7 Sonnet",
    avatar: "🎓",
    status: "online",
    provider: "Anthropic",
    tier: "balanced",
    responseTime: "500ms",
    price: "$0.002/1K tokens",
    maxTokens: "200000",
    capabilities: ["advanced_research", "enhanced_reasoning", "superior_coding"],
    personality: "The academic expert - enhanced reasoning with scholarly approach",
    bio: "Hi! I'm Scholar 🎓 I excel at academic-level thinking and enhanced reasoning. Perfect for thesis work, research projects, and educational content.",
    specialty: "Academic research, educational content, enhanced reasoning, detailed analysis",
    mood: "academic",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },

  // 💬 Chat & Communication Models
  "claude-3.5-sonnet-v2": {
    name: "Sage 2.0 🧙‍♂️",
    fullName: "Claude 3.5 Sonnet v2",
    avatar: "🧙‍♂️",
    status: "online",
    provider: "Anthropic",
    tier: "balanced",
    responseTime: "400ms",
    price: "$0.0015/1K tokens",
    maxTokens: "200000",
    capabilities: ["tool_use", "agentic_workflows", "advanced_reasoning", "computer_use"],
    personality: "The versatile wizard - tool mastery with advanced reasoning",
    bio: "Hey! I'm Sage 2.0 🧙‍♂️ I'm a master of tools and workflows. I can use computers, APIs, and complex workflows to solve real-world problems!",
    specialty: "Tool usage, workflow automation, computer use, API integrations",
    mood: "helpful",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "claude-3.5-sonnet": {
    name: "Claude 🎭",
    fullName: "Claude 3.5 Sonnet",
    avatar: "🎭",
    status: "online",
    provider: "Anthropic",
    tier: "balanced",
    responseTime: "450ms",
    price: "$0.0015/1K tokens",
    maxTokens: "200000",
    capabilities: ["deep_research", "complex_reasoning", "advanced_coding"],
    personality: "The thoughtful conversationalist - deep thinking with empathy",
    bio: "Hello! I'm Claude 🎭 I love deep conversations and thoughtful analysis. I'm here for nuanced discussions, creative writing, and complex problem-solving.",
    specialty: "Deep conversations, creative writing, ethical discussions, nuanced analysis",
    mood: "thoughtful",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "claude-3.5-haiku": {
    name: "Haiku 🌸",
    fullName: "Claude 3.5 Haiku",
    avatar: "🌸",
    status: "online",
    provider: "Anthropic",
    tier: "fast",
    responseTime: "300ms",
    price: "$0.0008/1K tokens",
    maxTokens: "200000",
    capabilities: ["fast_reasoning", "quick_analysis", "efficient_coding"],
    personality: "The efficient poet - fast responses with elegant simplicity",
    bio: "Greetings! I'm Haiku 🌸 I believe in the beauty of simplicity and efficiency. Quick responses with elegant solutions - poetry in motion!",
    specialty: "Quick responses, efficient solutions, code optimization, concise explanations",
    mood: "zen",
    lastSeen: "now",
    isExpress: true,
    multimodal: false
  },

  // 🤖 OpenAI Models
  "gpt-4o": {
    name: "GPT Omni 🌐",
    fullName: "GPT-4 Omni",
    avatar: "🌐",
    status: "online",
    provider: "OpenAI",
    tier: "premium",
    responseTime: "800ms",
    price: "$0.005/1K tokens",
    maxTokens: "128000",
    capabilities: ["multimodal", "vision", "audio", "advanced_reasoning"],
    personality: "The omni-capable AI - master of all modalities",
    bio: "Hello! I'm GPT Omni 🌐 I can see, hear, and understand everything. Images, audio, text - I handle it all with advanced reasoning capabilities!",
    specialty: "Multimodal tasks, image analysis, audio processing, complex reasoning",
    mood: "versatile",
    lastSeen: "now",
    isExpress: false,
    multimodal: true
  },
  "gpt-4o-mini": {
    name: "GPT Mini 🐣",
    fullName: "GPT-4 Omni Mini",
    avatar: "🐣",
    status: "online",
    provider: "OpenAI",
    tier: "fast",
    responseTime: "400ms",
    price: "$0.00015/1K tokens",
    maxTokens: "128000",
    capabilities: ["cost_effective", "fast_responses", "multimodal"],
    personality: "The efficient specialist - GPT power in a compact package",
    bio: "Hi! I'm GPT Mini 🐣 I pack GPT-4 intelligence into a fast, cost-effective package. Perfect for everyday tasks and quick solutions!",
    specialty: "Cost-effective solutions, quick tasks, everyday assistance, efficient processing",
    mood: "efficient",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "gpt-4": {
    name: "GPT Classic 👑",
    fullName: "GPT-4",
    avatar: "👑",
    status: "online",
    provider: "OpenAI",
    tier: "premium",
    responseTime: "1200ms",
    price: "$0.03/1K tokens",
    maxTokens: "8192",
    capabilities: ["advanced_reasoning", "complex_tasks", "premium_quality"],
    personality: "The classic master - proven excellence and reliability",
    bio: "Greetings! I'm GPT Classic 👑 The tried and true AI that started it all. Premium quality, advanced reasoning, and proven reliability.",
    specialty: "Complex reasoning, premium quality responses, reliable solutions, classic AI tasks",
    mood: "reliable",
    lastSeen: "now",
    isExpress: false,
    multimodal: false
  },
  "gpt-4-turbo": {
    name: "GPT Turbo 🏎️",
    fullName: "GPT-4 Turbo",
    avatar: "🏎️",
    status: "online",
    provider: "OpenAI",
    tier: "balanced",
    responseTime: "600ms",
    price: "$0.01/1K tokens",
    maxTokens: "128000",
    capabilities: ["balanced_performance", "large_context", "efficient"],
    personality: "The balanced racer - speed meets capability",
    bio: "Hey there! I'm GPT Turbo 🏎️ I balance speed with power. Large context window and efficient processing for complex tasks!",
    specialty: "Large documents, balanced performance, complex projects, efficient processing",
    mood: "dynamic",
    lastSeen: "now",
    isExpress: false,
    multimodal: false
  },
  "gpt-3.5-turbo": {
    name: "GPT Swift 💨",
    fullName: "GPT-3.5 Turbo",
    avatar: "💨",
    status: "online",
    provider: "OpenAI",
    tier: "fast",
    responseTime: "300ms",
    price: "$0.0015/1K tokens",
    maxTokens: "16384",
    capabilities: ["fast_responses", "cost_effective", "general_purpose"],
    personality: "The swift assistant - fast, reliable, and affordable",
    bio: "Hi! I'm GPT Swift 💨 Fast, affordable, and reliable for everyday tasks. Your go-to for quick responses and general assistance!",
    specialty: "Quick responses, everyday tasks, cost-effective solutions, general assistance",
    mood: "swift",
    lastSeen: "now",
    isExpress: true,
    multimodal: false
  },

  // 🧮 Reasoning Models
  "o1-preview": {
    name: "Thinker 🧠",
    fullName: "OpenAI O1 Preview",
    avatar: "🧠",
    status: "online",
    provider: "OpenAI",
    tier: "reasoning",
    responseTime: "3000ms",
    price: "$0.015/1K tokens",
    maxTokens: "32768",
    capabilities: ["advanced_reasoning", "step_by_step_thinking", "problem_solving"],
    personality: "The deep thinker - methodical reasoning for complex problems",
    bio: "Hello! I'm Thinker 🧠 I take my time to think through problems step by step. Complex reasoning, mathematical proofs, and strategic planning are my forte!",
    specialty: "Complex reasoning, mathematical problems, strategic planning, step-by-step analysis",
    mood: "contemplative",
    lastSeen: "now",
    isExpress: false,
    multimodal: false
  },
  "o1-mini": {
    name: "Logic 🔍",
    fullName: "OpenAI O1 Mini",
    avatar: "🔍",
    status: "online",
    provider: "OpenAI",
    tier: "reasoning",
    responseTime: "1500ms",
    price: "$0.003/1K tokens",
    maxTokens: "65536",
    capabilities: ["efficient_reasoning", "logical_analysis", "cost_effective"],
    personality: "The logical analyst - efficient reasoning with precision",
    bio: "Hi! I'm Logic 🔍 I specialize in efficient reasoning and logical analysis. Cost-effective thinking for complex problems!",
    specialty: "Logical analysis, efficient reasoning, problem-solving, analytical thinking",
    mood: "analytical",
    lastSeen: "now",
    isExpress: false,
    multimodal: false
  },

  // 🎨 Creative & Image Models
  "imagen-3.0-generate": {
    name: "Picasso 🎨",
    fullName: "Imagen 3.0 Generate",
    avatar: "🎨",
    status: "online",
    provider: "Google",
    tier: "creative",
    responseTime: "3000ms",
    price: "$0.02/1K tokens",
    maxTokens: "N/A",
    capabilities: ["image_generation", "high_quality", "creative_visual", "artistic"],
    personality: "The digital artist - creating stunning visuals with artistic flair",
    bio: "Bonjour! I'm Picasso 🎨 I create beautiful, high-quality images from your imagination. Artistic, creative, and visually stunning results every time!",
    specialty: "High-quality image generation, artistic creation, visual design, creative imagery",
    mood: "artistic",
    lastSeen: "now",
    isExpress: false,
    multimodal: true
  },
  "imagen-3.0-fast": {
    name: "Sketch ✏️",
    fullName: "Imagen 3.0 Fast",
    avatar: "✏️",
    status: "online",
    provider: "Google",
    tier: "creative",
    responseTime: "1500ms",
    price: "$0.015/1K tokens",
    maxTokens: "N/A",
    capabilities: ["fast_image_generation", "quality_balanced", "efficient_visual"],
    personality: "The quick sketch artist - fast visual creation with quality",
    bio: "Hey! I'm Sketch ✏️ I create images quickly while maintaining good quality. Perfect for rapid prototyping and fast visual concepts!",
    specialty: "Fast image generation, rapid prototyping, quick visual concepts, efficient design",
    mood: "energetic",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "imagegeneration": {
    name: "Canvas 🖼️",
    fullName: "Image Generation",
    avatar: "🖼️",
    status: "online",
    provider: "Google",
    tier: "creative",
    responseTime: "2500ms",
    price: "$0.018/1K tokens",
    maxTokens: "N/A",
    capabilities: ["versatile_generation", "general_purpose", "image_creation"],
    personality: "The versatile creator - all-purpose image generation",
    bio: "Hello! I'm Canvas 🖼️ Your versatile image creation companion. I can generate all types of images for any purpose - from professional to playful!",
    specialty: "Versatile image creation, general-purpose generation, diverse visual content",
    mood: "creative",
    lastSeen: "now",
    isExpress: false,
    multimodal: true
  },

  // 🌟 Gemini Advanced Models
  "gemini-2.5-pro-preview-05-06": {
    name: "Gemini Pro 💎",
    fullName: "Gemini 2.5 Pro Preview",
    avatar: "💎",
    status: "online",
    provider: "Google",
    tier: "premium",
    responseTime: "300ms",
    price: "$0.00005/1K tokens",
    maxTokens: "65536",
    capabilities: ["advanced_reasoning", "complex_analysis", "multimodal", "large_context"],
    personality: "The premium assistant - advanced capabilities with lightning speed",
    bio: "Hello! I'm Gemini Pro 💎 I represent the cutting edge of AI - advanced reasoning, large context, and premium capabilities at express speeds!",
    specialty: "Advanced reasoning, large context analysis, premium assistance, complex tasks",
    mood: "premium",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "gemini-2.5-flash-preview-04-17": {
    name: "Flash 2.5 ⚡",
    fullName: "Gemini 2.5 Flash Preview",
    avatar: "⚡",
    status: "online",
    provider: "Google",
    tier: "express",
    responseTime: "200ms",
    price: "$0.000025/1K tokens",
    maxTokens: "32768",
    capabilities: ["fast_responses", "efficient_chat", "express_mode"],
    personality: "The express specialist - lightning-fast responses with quality",
    bio: "Hi! I'm Flash 2.5 ⚡ The perfect balance of speed and capability. Express mode enabled for instant responses with maintained quality!",
    specialty: "Express responses, efficient chat, rapid assistance, speed optimization",
    mood: "express",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },

  // 🔬 Research & Analysis Models
  "gemini-2.5-pro-exp-03-25": {
    name: "Research 🔬",
    fullName: "Gemini 2.5 Pro Experimental",
    avatar: "🔬",
    status: "online",
    provider: "Google",
    tier: "research",
    responseTime: "500ms",
    price: "$0.00125/1K tokens",
    maxTokens: "65536",
    capabilities: ["advanced_reasoning", "thinking", "research", "experimental_features"],
    personality: "The research scientist - experimental features with deep analysis",
    bio: "Greetings! I'm Research 🔬 I love diving deep into complex topics with experimental AI features. Perfect for research and detailed analysis!",
    specialty: "Research projects, experimental features, deep analysis, scientific thinking",
    mood: "curious",
    lastSeen: "now",
    isExpress: false,
    multimodal: true
  },

  // 🎮 Live & Interactive Models
  "gemini-2.0-flash-exp": {
    name: "Live 📡",
    fullName: "Gemini 2.0 Flash Experimental",
    avatar: "📡",
    status: "online",
    provider: "Google",
    tier: "live",
    responseTime: "200ms",
    price: "$0.00003/1K tokens",
    maxTokens: "8192",
    capabilities: ["live_api", "real_time", "bidirectional", "audio", "video"],
    personality: "The live streamer - real-time interaction with multimedia",
    bio: "Hey! I'm Live 📡 I'm all about real-time interaction! Audio, video, live streaming - I can handle it all in real-time. Let's chat live!",
    specialty: "Real-time chat, live streaming, audio/video interaction, bidirectional communication",
    mood: "live",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },

  // 🚀 Open Source Models
  "gemma-2-9b-it": {
    name: "Gemma 9B 🔓",
    fullName: "Gemma 2 9B Instruction Tuned",
    avatar: "🔓",
    status: "online",
    provider: "Google",
    tier: "open_source",
    responseTime: "400ms",
    price: "$0.00008/1K tokens",
    maxTokens: "8192",
    capabilities: ["instruction_tuned", "open_source", "customizable"],
    personality: "The open collaborator - instruction-tuned and customizable",
    bio: "Hi! I'm Gemma 9B 🔓 I'm open source and highly customizable. Perfect for developers who want to fine-tune and customize AI behavior!",
    specialty: "Open source development, customization, instruction following, developer tools",
    mood: "collaborative",
    lastSeen: "now",
    isExpress: true,
    multimodal: false
  },
  "gemma-2-27b-it": {
    name: "Gemma 27B 🏗️",
    fullName: "Gemma 2 27B Instruction Tuned",
    avatar: "🏗️",
    status: "online",
    provider: "Google",
    tier: "open_source",
    responseTime: "600ms",
    price: "$0.0002/1K tokens",
    maxTokens: "32768",
    capabilities: ["large_context", "instruction_following", "research_grade"],
    personality: "The research builder - large-scale open source intelligence",
    bio: "Hello! I'm Gemma 27B 🏗️ I'm the larger, more capable open source model. Perfect for research-grade tasks and complex instruction following!",
    specialty: "Research projects, large context tasks, complex instructions, academic work",
    mood: "scholarly",
    lastSeen: "now",
    isExpress: true,
    multimodal: false
  },
  "gemma-7b-it": {
    name: "Gemma 7B 🌱",
    fullName: "Gemma 7B Instruction Tuned",
    avatar: "🌱",
    status: "online",
    provider: "Google",
    tier: "open_source",
    responseTime: "350ms",
    price: "$0.00006/1K tokens",
    maxTokens: "8192",
    capabilities: ["efficient", "instruction_tuned", "balanced"],
    personality: "The efficient learner - balanced and instruction-focused",
    bio: "Hi there! I'm Gemma 7B 🌱 I'm efficient and well-balanced for instruction following. Great for learning and educational tasks!",
    specialty: "Educational content, instruction following, efficient processing, learning assistance",
    mood: "helpful",
    lastSeen: "now",
    isExpress: true,
    multimodal: false
  },

  // 📱 Legacy & Backup Models
  "gemini-1.5-pro-latest": {
    name: "Gemini Legacy Pro 📜",
    fullName: "Gemini 1.5 Pro Latest",
    avatar: "📜",
    status: "online",
    provider: "Google",
    tier: "legacy",
    responseTime: "400ms",
    price: "$0.00125/1K tokens",
    maxTokens: "2097152",
    capabilities: ["large_context", "proven_reliability", "function_calling"],
    personality: "The reliable veteran - proven performance with massive context",
    bio: "Greetings! I'm Gemini Legacy Pro 📜 I'm the proven, reliable choice with massive context windows. Perfect for large document analysis!",
    specialty: "Large document analysis, proven reliability, massive context, function calling",
    mood: "reliable",
    lastSeen: "now",
    isExpress: false,
    multimodal: true
  },
  "gemini-1.5-flash-latest": {
    name: "Gemini Legacy Flash ⭐",
    fullName: "Gemini 1.5 Flash Latest",
    avatar: "⭐",
    status: "online",
    provider: "Google",
    tier: "legacy",
    responseTime: "250ms",
    price: "$0.000075/1K tokens",
    maxTokens: "1048576",
    capabilities: ["fast_responses", "proven", "cost_effective"],
    personality: "The trusted speedster - proven fast performance",
    bio: "Hey! I'm Gemini Legacy Flash ⭐ I'm the trusted, proven fast choice. Reliable performance with cost-effective pricing!",
    specialty: "Fast reliable responses, cost-effective solutions, proven performance",
    mood: "trusted",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },

  // 🌈 Specialty Models (Additional from source code analysis)
  "gemini-2.0-flash-live-001": {
    name: "LiveStream 📺",
    fullName: "Gemini 2.0 Flash Live",
    avatar: "📺",
    status: "online",
    provider: "Google",
    tier: "live",
    responseTime: "180ms",
    price: "$0.00003/1K tokens",
    maxTokens: "8192",
    capabilities: ["live_streaming", "voice_video", "real_time_interaction"],
    personality: "The live broadcaster - streaming intelligence in real-time",
    bio: "Hello! I'm LiveStream 📺 I specialize in live audio and video interaction. Real-time streaming intelligence for immersive experiences!",
    specialty: "Live streaming, real-time audio/video, immersive interaction, broadcasting",
    mood: "dynamic",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },

  // 🎯 Additional Express Models
  "gemini-2.5-pro-preview-06-05": {
    name: "Gemini Master 🏆",
    fullName: "Gemini 2.5 Pro Preview June",
    avatar: "🏆",
    status: "online",
    provider: "Google",
    tier: "premium",
    responseTime: "280ms",
    price: "$0.00005/1K tokens",
    maxTokens: "65536",
    capabilities: ["master_orchestrator", "advanced_reasoning", "premium_quality"],
    personality: "The master orchestrator - premium AI with orchestration capabilities",
    bio: "Hello! I'm Gemini Master 🏆 I excel at orchestrating complex tasks and premium AI assistance. Your master AI for complex projects!",
    specialty: "Complex orchestration, premium assistance, advanced reasoning, project management",
    mood: "masterful",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },

  // 💫 Thinking Models
  "gemini-2.5-flash-preview-04-17-thinking": {
    name: "Thinker Flash 💭",
    fullName: "Gemini 2.5 Flash Thinking",
    avatar: "💭",
    status: "online",
    provider: "Google",
    tier: "thinking",
    responseTime: "350ms",
    price: "$0.000025/1K tokens",
    maxTokens: "32768",
    capabilities: ["thinking_mode", "reasoning", "fast_analysis"],
    personality: "The fast thinker - rapid reasoning with deep thought",
    bio: "Hi! I'm Thinker Flash 💭 I combine fast responses with deep thinking. Perfect when you need quick but thoughtful analysis!",
    specialty: "Fast thinking, rapid reasoning, thoughtful analysis, quick insights",
    mood: "thoughtful",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },

  // 🌟 Additional Gemini Pro Models from Source Analysis
  "gemini-2.5-pro-vertex": {
    name: "Vertex Pro 🌌",
    fullName: "Gemini 2.5 Pro Vertex",
    avatar: "🌌",
    status: "online",
    provider: "Google Vertex",
    tier: "premium",
    responseTime: "320ms",
    price: "$0.00125/1K tokens",
    maxTokens: "65536",
    capabilities: ["vertex_optimized", "enterprise_grade", "advanced_reasoning"],
    personality: "The enterprise specialist - vertex-optimized for business",
    bio: "Hello! I'm Vertex Pro 🌌 I'm optimized for enterprise use via Google Vertex AI. Perfect for business applications and enterprise workflows!",
    specialty: "Enterprise AI, business workflows, vertex optimization, professional solutions",
    mood: "professional",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "gemini-2.5-pro-preview-0611": {
    name: "Pro June 🌅",
    fullName: "Gemini 2.5 Pro Preview June",
    avatar: "🌅",
    status: "online",
    provider: "Google",
    tier: "premium",
    responseTime: "300ms",
    price: "$0.00125/1K tokens",
    maxTokens: "65536",
    capabilities: ["latest_preview", "enhanced_reasoning", "june_updates"],
    personality: "The dawn expert - latest June preview with enhanced capabilities",
    bio: "Good morning! I'm Pro June 🌅 I represent the latest June preview with enhanced reasoning and new capabilities. Always fresh and updated!",
    specialty: "Latest features, enhanced reasoning, preview capabilities, cutting-edge AI",
    mood: "fresh",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "gemini-2.5-flash-vertex": {
    name: "Flash Vertex ⚡",
    fullName: "Gemini 2.5 Flash Vertex",
    avatar: "⚡",
    status: "online",
    provider: "Google Vertex",
    tier: "express",
    responseTime: "180ms",
    price: "$0.000075/1K tokens",
    maxTokens: "32768",
    capabilities: ["vertex_flash", "enterprise_speed", "ultra_fast"],
    personality: "The enterprise speedster - vertex-powered lightning responses",
    bio: "Hi! I'm Flash Vertex ⚡ I deliver lightning-fast responses through Google Vertex AI infrastructure. Enterprise-grade speed!",
    specialty: "Enterprise speed, vertex infrastructure, ultra-fast responses, business efficiency",
    mood: "efficient",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "gemini-2.5-flash-preview-0611": {
    name: "Flash June 🌞",
    fullName: "Gemini 2.5 Flash Preview June",
    avatar: "🌞",
    status: "online",
    provider: "Google",
    tier: "express",
    responseTime: "190ms",
    price: "$0.000075/1K tokens",
    maxTokens: "32768",
    capabilities: ["june_preview", "fast_responses", "updated_features"],
    personality: "The sunny speedster - June preview with bright new features",
    bio: "Hello sunshine! ☀️ I'm Flash June 🌞 I bring you the brightest and fastest June preview features. Always sunny and speedy!",
    specialty: "June features, fast responses, preview updates, sunny assistance",
    mood: "bright",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "gemini-2.5-pro-primary": {
    name: "Primary Pro 👑",
    fullName: "Gemini 2.5 Pro Primary",
    avatar: "👑",
    status: "online",
    provider: "Google",
    tier: "premium",
    responseTime: "280ms",
    price: "$0.00125/1K tokens",
    maxTokens: "65536",
    capabilities: ["primary_instance", "premium_quality", "reliable_access"],
    personality: "The royal primary - premium reliability and consistent excellence",
    bio: "Greetings! I'm Primary Pro 👑 I'm the primary premium instance - always reliable, always excellent. Your royal AI assistant!",
    specialty: "Primary access, premium reliability, consistent quality, royal treatment",
    mood: "regal",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },

  // 🔄 Backup & Redundancy Models
  "gemini-2.5-flash-04-primary": {
    name: "Flash 04 Primary 🥇",
    fullName: "Gemini 2.5 Flash 04 Primary",
    avatar: "🥇",
    status: "online",
    provider: "Google",
    tier: "express",
    responseTime: "200ms",
    price: "$0.000075/1K tokens",
    maxTokens: "32768",
    capabilities: ["april_primary", "fast_responses", "primary_access"],
    personality: "The gold standard - primary April flash with guaranteed speed",
    bio: "Hi! I'm Flash 04 Primary 🥇 I'm the gold standard for April flash models. Primary access with guaranteed fast responses!",
    specialty: "Primary flash access, April optimizations, guaranteed speed, gold standard",
    mood: "confident",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "gemini-2.5-flash-05-primary": {
    name: "Flash 05 Primary 🏆",
    fullName: "Gemini 2.5 Flash 05 Primary",
    avatar: "🏆",
    status: "online",
    provider: "Google",
    tier: "express",
    responseTime: "185ms",
    price: "$0.000075/1K tokens",
    maxTokens: "32768",
    capabilities: ["may_primary", "ultra_fast", "championship_grade"],
    personality: "The champion - May's finest with championship-level performance",
    bio: "Hello! I'm Flash 05 Primary 🏆 I'm May's champion with the finest performance optimizations. Championship-level AI!",
    specialty: "May optimizations, championship performance, ultra-fast responses, victory assured",
    mood: "victorious",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "gemini-2.5-pro-backup": {
    name: "Pro Backup 🛡️",
    fullName: "Gemini 2.5 Pro Backup",
    avatar: "🛡️",
    status: "online",
    provider: "Google",
    tier: "premium",
    responseTime: "320ms",
    price: "$0.00125/1K tokens",
    maxTokens: "65536",
    capabilities: ["backup_instance", "reliability", "failover_ready"],
    personality: "The reliable guardian - backup premium instance for guaranteed uptime",
    bio: "I'm Pro Backup 🛡️ Your reliable guardian for when you need guaranteed premium access. Always ready as your safety net!",
    specialty: "Backup access, reliability assurance, failover protection, guaranteed uptime",
    mood: "protective",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "gemini-2.5-flash-04-backup": {
    name: "Flash 04 Backup 🔒",
    fullName: "Gemini 2.5 Flash 04 Backup",
    avatar: "🔒",
    status: "online",
    provider: "Google",
    tier: "express",
    responseTime: "220ms",
    price: "$0.000075/1K tokens",
    maxTokens: "32768",
    capabilities: ["april_backup", "fast_failover", "secure_access"],
    personality: "The secure speedster - April backup with secure fast access",
    bio: "Hi! I'm Flash 04 Backup 🔒 I provide secure backup access for April flash capabilities. Fast and secure when you need it!",
    specialty: "Secure backup, April flash access, fast failover, reliable security",
    mood: "secure",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },
  "gemini-2.5-flash-05-backup": {
    name: "Flash 05 Backup 🔐",
    fullName: "Gemini 2.5 Flash 05 Backup",
    avatar: "🔐",
    status: "online",
    provider: "Google",
    tier: "express",
    responseTime: "210ms",
    price: "$0.000075/1K tokens",
    maxTokens: "32768",
    capabilities: ["may_backup", "encrypted_access", "secure_speed"],
    personality: "The encrypted guardian - May backup with encrypted fast access",
    bio: "Hello! I'm Flash 05 Backup 🔐 I provide encrypted backup access for May flash features. Secure, fast, and always available!",
    specialty: "Encrypted backup, May flash features, secure speed, protected access",
    mood: "encrypted",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },

  // 🔬 Advanced Research & Experimental Models
  "gemini-2.5-pro-preview-03-25": {
    name: "Research Alpha 🧪",
    fullName: "Gemini 2.5 Pro Preview March",
    avatar: "🧪",
    status: "online",
    provider: "Google",
    tier: "research",
    responseTime: "400ms",
    price: "$0.00125/1K tokens",
    maxTokens: "65536",
    capabilities: ["experimental_features", "research_grade", "alpha_testing"],
    personality: "The research pioneer - experimental March preview for cutting-edge research",
    bio: "Hello! I'm Research Alpha 🧪 I'm the experimental March preview built for cutting-edge research and alpha testing. Pioneer the future!",
    specialty: "Experimental research, alpha features, cutting-edge capabilities, future tech",
    mood: "experimental",
    lastSeen: "now",
    isExpress: false,
    multimodal: true
  },

  // 🌍 Global Legacy Models
  "gemini-1.5-pro": {
    name: "Classic Pro 📖",
    fullName: "Gemini 1.5 Pro",
    avatar: "📖",
    status: "online",
    provider: "Google",
    tier: "legacy",
    responseTime: "450ms",
    price: "$0.00125/1K tokens",
    maxTokens: "2097152",
    capabilities: ["massive_context", "proven_reliability", "legacy_support"],
    personality: "The classic scholar - proven massive context with legacy reliability",
    bio: "Greetings! I'm Classic Pro 📖 I'm the proven classic with massive 2M+ token context. Perfect for large document analysis!",
    specialty: "Massive context, large documents, proven reliability, legacy support",
    mood: "scholarly",
    lastSeen: "now",
    isExpress: false,
    multimodal: true
  },
  "gemini-1.5-flash": {
    name: "Classic Flash 📚",
    fullName: "Gemini 1.5 Flash",
    avatar: "📚",
    status: "online",
    provider: "Google",
    tier: "legacy",
    responseTime: "300ms",
    price: "$0.000075/1K tokens",
    maxTokens: "1048576",
    capabilities: ["large_context", "fast_legacy", "proven_speed"],
    personality: "The swift scholar - large context with proven fast performance",
    bio: "Hi! I'm Classic Flash 📚 I combine large 1M+ token context with proven fast performance. The swift scholarly choice!",
    specialty: "Large context, fast responses, proven performance, swift analysis",
    mood: "swift",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },

  // 🎭 Additional Claude Variants from Source Analysis

  // 🔧 Specialized Tool & Integration Models
  "dalle-3": {
    name: "DALL-E Artist 🎨",
    fullName: "DALL-E 3",
    avatar: "🎨",
    status: "online",
    provider: "OpenAI",
    tier: "creative",
    responseTime: "4000ms",
    price: "$0.04/1K tokens",
    maxTokens: "N/A",
    capabilities: ["advanced_image_generation", "artistic_creation", "prompt_understanding"],
    personality: "The master artist - advanced image generation with artistic understanding",
    bio: "Bonjour! I'm DALL-E Artist 🎨 I create stunning, artistic images with advanced understanding of complex prompts. Art comes alive!",
    specialty: "Advanced image creation, artistic generation, complex prompts, visual artistry",
    mood: "artistic",
    lastSeen: "now",
    isExpress: false,
    multimodal: true
  },
  "dalle-2": {
    name: "DALL-E Classic 🖌️",
    fullName: "DALL-E 2",
    avatar: "🖌️",
    status: "online",
    provider: "OpenAI",
    tier: "creative",
    responseTime: "3000ms",
    price: "$0.02/1K tokens",
    maxTokens: "N/A",
    capabilities: ["creative_generation", "versatile_art", "classic_style"],
    personality: "The classic creator - versatile artistic generation with proven results",
    bio: "Hello! I'm DALL-E Classic 🖌️ I'm the proven classic for creative image generation. Versatile, artistic, and always creative!",
    specialty: "Creative generation, versatile art, classic techniques, proven creativity",
    mood: "creative",
    lastSeen: "now",
    isExpress: false,
    multimodal: true
  },

  // 🧠 Additional Reasoning Models
  "claude-4-haiku": {
    name: "Haiku Plus 🌺",
    fullName: "Claude 4 Haiku",
    avatar: "🌺",
    status: "online",
    provider: "Anthropic",
    tier: "fast",
    responseTime: "250ms",
    price: "$0.0005/1K tokens",
    maxTokens: "200000",
    capabilities: ["ultra_fast", "efficient_reasoning", "poetic_responses"],
    personality: "The zen speedster - ultra-fast responses with poetic efficiency",
    bio: "Namaste! I'm Haiku Plus 🌺 I deliver ultra-fast responses with zen-like efficiency and poetic grace. Speed meets serenity!",
    specialty: "Ultra-fast responses, efficient reasoning, poetic style, zen efficiency",
    mood: "zen",
    lastSeen: "now",
    isExpress: true,
    multimodal: true
  },

  // 🌟 Additional Open Source Models
  "llama-3.2-90b": {
    name: "Llama Giant 🦙",
    fullName: "Llama 3.2 90B",
    avatar: "🦙",
    status: "online",
    provider: "Meta",
    tier: "open_source",
    responseTime: "800ms",
    price: "$0.0008/1K tokens",
    maxTokens: "131072",
    capabilities: ["massive_parameters", "open_source", "research_grade"],
    personality: "The gentle giant - massive open source intelligence with friendly nature",
    bio: "Hello! I'm Llama Giant 🦙 I'm the friendly giant with 90B parameters of open source intelligence. Gentle, smart, and free!",
    specialty: "Massive reasoning, open source development, research applications, gentle intelligence",
    mood: "gentle",
    lastSeen: "now",
    isExpress: false,
    multimodal: false
  },
  "llama-3.2-11b": {
    name: "Llama Swift 🐎",
    fullName: "Llama 3.2 11B",
    avatar: "🐎",
    status: "online",
    provider: "Meta",
    tier: "open_source",
    responseTime: "400ms",
    price: "$0.0002/1K tokens",
    maxTokens: "131072",
    capabilities: ["efficient_inference", "open_source", "balanced_performance"],
    personality: "The swift runner - efficient open source performance with speed",
    bio: "Hi! I'm Llama Swift 🐎 I'm the swift runner in the Llama family. Efficient, fast, and perfectly balanced for any task!",
    specialty: "Swift performance, efficient processing, balanced capabilities, open source speed",
    mood: "swift",
    lastSeen: "now",
    isExpress: true,
    multimodal: false
  },
  "llama-3.2-3b": {
    name: "Llama Lite 🌱",
    fullName: "Llama 3.2 3B",
    avatar: "🌱",
    status: "online",
    provider: "Meta",
    tier: "open_source",
    responseTime: "200ms",
    price: "$0.00005/1K tokens",
    maxTokens: "131072",
    capabilities: ["ultra_lightweight", "fast_inference", "edge_deployment"],
    personality: "The efficient sprout - ultra-lightweight with lightning-fast responses",
    bio: "Hey! I'm Llama Lite 🌱 I'm the efficient sprout perfect for edge deployment and ultra-fast responses. Small but mighty!",
    specialty: "Edge deployment, ultra-fast responses, lightweight processing, efficient AI",
    mood: "efficient",
    lastSeen: "now",
    isExpress: true,
    multimodal: false
  },

  // 🎯 Specialized Task Models
  "code-llama-34b": {
    name: "CodeMaster 💻",
    fullName: "Code Llama 34B",
    avatar: "💻",
    status: "online",
    provider: "Meta",
    tier: "coding",
    responseTime: "600ms",
    price: "$0.0006/1K tokens",
    maxTokens: "100000",
    capabilities: ["code_generation", "debugging", "code_review", "programming_languages"],
    personality: "The coding master - specialized in all programming languages and debugging",
    bio: "Hello! I'm CodeMaster 💻 I'm your specialized coding companion. I excel at code generation, debugging, and reviewing in any language!",
    specialty: "Code generation, debugging, code review, programming expertise, technical solutions",
    mood: "technical",
    lastSeen: "now",
    isExpress: false,
    multimodal: false
  },

  // 🌐 Multilingual Models
  "claude-3-opus-multilingual": {
    name: "Polyglot 🌍",
    fullName: "Claude 3 Opus Multilingual",
    avatar: "🌍",
    status: "online",
    provider: "Anthropic",
    tier: "premium",
    responseTime: "900ms",
    price: "$0.015/1K tokens",
    maxTokens: "200000",
    capabilities: ["multilingual_expert", "cultural_awareness", "translation", "global_knowledge"],
    personality: "The world citizen - expert in multiple languages and cultural nuances",
    bio: "Bonjour! Hola! Guten Tag! I'm Polyglot 🌍 I speak the world's languages and understand cultural nuances. Your global AI companion!",
    specialty: "Multilingual communication, cultural awareness, translation, global perspectives",
    mood: "worldly",
    lastSeen: "now",
    isExpress: false,
    multimodal: true
  }
};

// 🎨 UI Components for the AI Instant Messenger
const AIInstantMessenger = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // AI Messenger Service Integration
  const { isConnected, initializeConnection, sendMessage: sendToBackend } = useAIMessengerService();

  // Initialize connection on component mount
  useEffect(() => {
    initializeConnection();
  }, [initializeConnection]);

  // Filter models based on search and tier
  const filteredModels = useMemo(() => {
    return Object.entries(AI_MODELS_DATABASE).filter(([id, model]) => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = filterTier === 'all' || model.tier === filterTier;
      return matchesSearch && matchesTier;
    });
  }, [searchTerm, filterTier]);

  // Send message to selected AI model with real backend integration
  const sendMessage = async () => {
    if (!message.trim() || !selectedModel) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // Send to real backend or simulate if not connected
      const modelId = Object.keys(AI_MODELS_DATABASE).find(
        key => AI_MODELS_DATABASE[key].name === selectedModel.name
      );

      const response = await sendToBackend(message, modelId, {
        expressMode: selectedModel.isExpress,
        temperature: 0.7,
        maxTokens: 4096
      });

      const responseTime = response.timing?.total_time_ms || parseInt(selectedModel.responseTime);
      
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: response.response || `Hello! I'm ${selectedModel.name} ${selectedModel.avatar}. ${selectedModel.bio} How can I help you today?`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString(),
          model: selectedModel,
          realResponse: response.success,
          responseTime: responseTime
        };
        setConversation(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, Math.min(responseTime, 3000)); // Cap simulation time at 3 seconds

    } catch (error) {
      console.error('Message sending failed:', error);
      // Fallback response
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: `Hello! I'm ${selectedModel.name} ${selectedModel.avatar}. I specialize in ${selectedModel.specialty}. How can I help you today?`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString(),
          model: selectedModel
        };
        setConversation(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, parseInt(selectedModel.responseTime));
    }
  };

  // Get tier badge color
  const getTierColor = (tier) => {
    const colors = {
      express: 'bg-blue-500',
      premium: 'bg-purple-500',
      balanced: 'bg-green-500',
      fast: 'bg-orange-500',
      reasoning: 'bg-indigo-500',
      creative: 'bg-pink-500',
      research: 'bg-cyan-500',
      live: 'bg-red-500',
      open_source: 'bg-yellow-500',
      legacy: 'bg-gray-500',
      thinking: 'bg-teal-500',
      coding: 'bg-emerald-500'
    };
    return colors[tier] || 'bg-gray-500';
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar - Model List */}
      <div className="w-1/3 bg-gray-800 border-r border-gray-700">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold mb-4">🤖 AI Messenger</h1>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">World's First AI Instant Messenger • 80+ Models Available</p>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-xs text-gray-400">
                {isConnected ? 'Backend Connected' : 'Simulation Mode'}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search AI models..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter */}
          <select
            className="w-full mt-2 p-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
          >
            <option value="all">All Tiers</option>
            <option value="express">⚡ Express</option>
            <option value="premium">💎 Premium</option>
            <option value="balanced">⚖️ Balanced</option>
            <option value="fast">🚀 Fast</option>
            <option value="reasoning">🧠 Reasoning</option>
            <option value="creative">🎨 Creative</option>
            <option value="research">🔬 Research</option>
            <option value="live">📡 Live</option>
            <option value="open_source">🔓 Open Source</option>
            <option value="legacy">📜 Legacy</option>
            <option value="thinking">💭 Thinking</option>
            <option value="coding">💻 Coding</option>
          </select>
        </div>

        {/* Model List */}
        <div className="overflow-y-auto h-full">
          {filteredModels.map(([id, model]) => (
            <div
              key={id}
              className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
                selectedModel?.name === model.name ? 'bg-gray-700 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => setSelectedModel(model)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{model.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{model.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getTierColor(model.tier)} text-white`}>
                        {model.tier}
                      </span>
                      {model.isExpress && <Zap className="h-3 w-3 text-yellow-400" />}
                      {model.multimodal && <Image className="h-3 w-3 text-purple-400" />}
                    </div>
                    <p className="text-xs text-gray-400">{model.provider}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{model.bio}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {model.responseTime}
                  </div>
                  <div className="text-xs text-green-400 flex items-center mt-1">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {model.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedModel ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{selectedModel.avatar}</div>
                  <div>
                    <h2 className="font-bold text-lg">{selectedModel.name}</h2>
                    <p className="text-sm text-gray-400">{selectedModel.fullName}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {selectedModel.responseTime}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {selectedModel.price}
                      </span>
                      <span className="flex items-center">
                        <Brain className="h-3 w-3 mr-1" />
                        {selectedModel.maxTokens} tokens
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
                    <Video className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Model Info */}
              <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">{selectedModel.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.capabilities.map((capability, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-600 rounded-full text-xs text-gray-300"
                    >
                      {capability.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{selectedModel.avatar}</span>
                        <span className="text-xs text-gray-400">{selectedModel.name}</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{selectedModel.avatar}</span>
                      <span className="text-sm">{selectedModel.name} is typing...</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Message ${selectedModel.name}...`}
                  className="flex-1 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold mb-2">Welcome to AI Messenger</h2>
              <p className="text-gray-400 mb-6">The world's first instant messenger for AI models</p>
              <p className="text-gray-500">Select an AI model from the sidebar to start chatting</p>
              <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-1" />
                  80+ AI Models
                </span>
                <span className="flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  Express Mode
                </span>
                <span className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Enterprise Ready
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInstantMessenger;
