# backend/services/orchestration/enhanced_agentic_conductor.py
"""
🎼 Enhanced Agentic Conductor with MCP + RAG Integration
Upgrades your existing conductor with autonomous intelligence
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple
import google.generativeai as genai

from .conductor import GeminiConductor
from .model_registry import GEMINI_REGISTRY, ModelCapability, MAMA_BEAR_MODEL_PREFERENCES
from ..mcp_agentic_rag_gemini_integration import (
    MCPAgenticRAGOrchestrator, 
    AgenticRAGDecision,
    RAGIntelligenceLevel
)

logger = logging.getLogger(__name__)

class EnhancedAgenticConductor(GeminiConductor):
    """
    🧠 Enhanced Conductor with Agentic RAG Capabilities
    
    Extends your existing conductor with:
    - Autonomous context retrieval
    - Predictive model selection
    - Cross-session learning
    - Real-time optimization
    """
    
    def __init__(self, api_key: str, rag_orchestrator: MCPAgenticRAGOrchestrator = None):
        super().__init__(api_key)
        
        # Agentic RAG integration
        self.rag_orchestrator = rag_orchestrator
        self.agentic_mode = True
        
        # Enhanced routing with memory
        self.routing_memory = {}
        self.success_patterns = {}
        self.user_preferences = {}
        
        # Predictive routing
        self.routing_predictions = {}
        self.context_preload_cache = {}
        
        logger.info("🧠 Enhanced Agentic Conductor initialized")
    
    async def analyze_and_route_with_rag(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """
        🚀 Enhanced routing with agentic RAG capabilities
        """
        
        # Step 1: Check if we have agentic RAG available
        if self.rag_orchestrator and self.agentic_mode:
            return await self._agentic_analyze_and_route(request)
        else:
            # Fallback to original conductor
            return await self.analyze_and_route(request)
    
    async def _agentic_analyze_and_route(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Agentic analysis with RAG enhancement"""
        
        user_id = request.get("user_id", "anonymous")
        message = request.get("message", "")
        
        # Step 1: Get enhanced context from RAG
        rag_context = await self._get_rag_enhanced_context(request)
        
        # Step 2: Predictive routing based on context and patterns
        predicted_routing = await self._predict_optimal_routing(request, rag_context)
        
        # Step 3: Enhanced routing prompt with RAG context
        enhanced_prompt = self._build_enhanced_routing_prompt(request, rag_context, predicted_routing)
        
        # Step 4: Get routing decision from conductor with enhanced context
        try:
            response = await self.conductor_model.generate_content_async(enhanced_prompt)
            routing_decision = self._parse_routing_response(response.text)
            
            # Step 5: Apply agentic enhancements
            routing_decision = await self._apply_agentic_enhancements(
                routing_decision, rag_context, predicted_routing
            )
            
            # Step 6: Learn from this routing decision
            await self._learn_from_routing_decision(request, routing_decision, rag_context)
            
            return routing_decision
            
        except Exception as e:
            logger.error(f"Enhanced agentic routing failed: {e}")
            # Fallback to predicted routing
            return predicted_routing
    
    async def _get_rag_enhanced_context(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Get enhanced context from RAG orchestrator"""
        
        if not self.rag_orchestrator:
            return {}
        
        try:
            # Use RAG orchestrator to get enhanced context
            rag_response = await self.rag_orchestrator.process_agentic_request(
                user_request=request.get("message", ""),
                user_id=request.get("user_id", "anonymous"),
                session_context=request
            )
            
            return rag_response.get("agentic_enhancements", {})
            
        except Exception as e:
            logger.error(f"RAG context retrieval failed: {e}")
            return {}
    
    async def _predict_optimal_routing(self, 
                                     request: Dict[str, Any], 
                                     rag_context: Dict[str, Any]) -> Dict[str, Any]:
        """Predict optimal routing based on patterns and context"""
        
        user_id = request.get("user_id", "anonymous")
        message = request.get("message", "")
        
        # Check if we have successful patterns for similar requests
        similar_patterns = await self._find_similar_successful_patterns(message, user_id)
        
        if similar_patterns:
            # Use patterns to predict optimal routing
            predicted_routing = {
                "primary_model": similar_patterns["most_successful_model"],
                "fallback_models": similar_patterns["successful_fallbacks"],
                "reasoning": f"Predicted based on {len(similar_patterns['patterns'])} similar successful patterns",
                "estimated_tokens": similar_patterns["avg_tokens"],
                "routing_confidence": similar_patterns["confidence"],
                "pattern_based": True,
                "patterns_used": len(similar_patterns["patterns"])
            }
        else:
            # Use enhanced heuristics with RAG context
            predicted_routing = await self._heuristic_routing_with_context(request, rag_context)
        
        return predicted_routing
    
    def _build_enhanced_routing_prompt(self, 
                                     request: Dict[str, Any], 
                                     rag_context: Dict[str, Any],
                                     predicted_routing: Dict[str, Any]) -> str:
        """Build enhanced routing prompt with RAG context"""
        
        base_prompt = self._build_routing_prompt(
            request.get("message", ""),
            request.get("task_type", "general"),
            request.get("mama_bear_variant"),
            request.get("context_size", 0),
            request.get("urgency", "normal"),
            request.get("require_speed", False),
            request.get("require_creativity", False),
            request.get("require_reasoning", False),
            request.get("max_tokens_needed", 1000)
        )
        
        # Add RAG enhancements
        rag_enhancement = f"""
🧠 AGENTIC RAG ENHANCEMENTS:

Enhanced Context Available:
- Memory Sources: {len(rag_context.get('context_sources_used', []))}
- RAG Decisions Made: {rag_context.get('rag_decisions_made', 0)}
- Intelligence Level: {rag_context.get('intelligence_level', 'Standard')}

Predicted Optimal Routing:
- Predicted Primary: {predicted_routing.get('primary_model', 'Unknown')}
- Prediction Confidence: {predicted_routing.get('routing_confidence', 0.5):.2f}
- Based on: {predicted_routing.get('reasoning', 'Heuristics')}

User Patterns:
- Has Memory History: {len(rag_context.get('memories', [])) > 0}
- Session Depth: {len(request.get('conversation_history', []))}
- Preferred Models: {self._get_user_preferred_models(request.get('user_id', 'anonymous'))}

🎯 ENHANCED ROUTING GUIDANCE:
Consider the RAG context and predictions when making your routing decision.
If the predicted routing has high confidence (>0.8), strongly consider it.
Factor in the user's memory patterns and session context.
"""
        
        return base_prompt + rag_enhancement
    
    async def _apply_agentic_enhancements(self,
                                        routing_decision: Dict[str, Any],
                                        rag_context: Dict[str, Any],
                                        predicted_routing: Dict[str, Any]) -> Dict[str, Any]:
        """Apply agentic enhancements to routing decision"""
        
        enhanced_decision = routing_decision.copy()
        
        # Add agentic metadata
        enhanced_decision["agentic_enhancements"] = {
            "rag_context_used": bool(rag_context),
            "prediction_available": bool(predicted_routing.get("pattern_based")),
            "memory_sources": len(rag_context.get("memories", [])),
            "context_expansion_applied": rag_context.get("context_expansion", False),
            "cross_session_learning": rag_context.get("learning_applied", False)
        }
        
        # Apply confidence boosting from patterns
        if predicted_routing.get("pattern_based") and predicted_routing.get("routing_confidence", 0) > 0.8:
            # High confidence prediction - boost routing confidence
            enhanced_decision["routing_confidence"] = min(
                enhanced_decision.get("routing_confidence", 0.5) + 0.2,
                1.0
            )
            enhanced_decision["reasoning"] += f" [Enhanced by high-confidence pattern matching]"
        
        # Apply memory-based optimizations
        if len(rag_context.get("memories", [])) > 3:
            # Rich memory context available - prefer models good with context
            if "context_master" not in enhanced_decision["primary_model"]:
                if enhanced_decision["primary_model"] in ["speed_demon_primary", "speed_demon_backup"]:
                    # Upgrade from speed to context-aware models
                    enhanced_decision["fallback_models"].insert(0, enhanced_decision["primary_model"])
                    enhanced_decision["primary_model"] = "context_master_primary"
                    enhanced_decision["reasoning"] += f" [Upgraded to context-aware model due to rich memory]"
        
        # Apply neurodivergent optimizations
        if self._detect_neurodivergent_needs(rag_context):
            enhanced_decision["special_instructions"] = enhanced_decision.get("special_instructions", "") + \
                " Use gentle, clear language with reduced cognitive load. Break complex responses into steps."
        
        return enhanced_decision
    
    async def _learn_from_routing_decision(self,
                                         request: Dict[str, Any],
                                         routing_decision: Dict[str, Any],
                                         rag_context: Dict[str, Any]) -> None:
        """Learn from routing decisions for future optimization"""
        
        user_id = request.get("user_id", "anonymous")
        message = request.get("message", "")
        
        # Store routing pattern
        pattern_key = self._generate_pattern_key(message)
        
        if pattern_key not in self.routing_memory:
            self.routing_memory[pattern_key] = []
        
        self.routing_memory[pattern_key].append({
            "request": request,
            "routing_decision": routing_decision,
            "rag_context": rag_context,
            "timestamp": datetime.now(),
            "user_id": user_id
        })
        
        # Update user preferences
        if user_id not in self.user_preferences:
            self.user_preferences[user_id] = {"model_usage": {}, "success_patterns": []}
        
        model_used = routing_decision.get("primary_model", "unknown")
        self.user_preferences[user_id]["model_usage"][model_used] = \
            self.user_preferences[user_id]["model_usage"].get(model_used, 0) + 1
    
    async def _find_similar_successful_patterns(self, message: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Find similar successful patterns from memory"""
        
        pattern_key = self._generate_pattern_key(message)
        
        if pattern_key not in self.routing_memory:
            return None
        
        # Get patterns for this type of request
        patterns = self.routing_memory[pattern_key]
        
        if not patterns:
            return None
        
        # Filter by successful outcomes (you'd track this in production)
        successful_patterns = [p for p in patterns if p.get("success", True)]  # Default to success
        
        if not successful_patterns:
            return None
        
        # Analyze successful patterns
        model_counts = {}
        total_tokens = 0
        
        for pattern in successful_patterns:
            model = pattern["routing_decision"].get("primary_model", "unknown")
            model_counts[model] = model_counts.get(model, 0) + 1
            total_tokens += pattern["routing_decision"].get("estimated_tokens", 1000)
        
        most_successful_model = max(model_counts.keys(), key=lambda x: model_counts[x])
        avg_tokens = total_tokens // len(successful_patterns)
        
        return {
            "most_successful_model": most_successful_model,
            "successful_fallbacks": [m for m in model_counts.keys() if m != most_successful_model],
            "avg_tokens": avg_tokens,
            "confidence": len(successful_patterns) / max(len(patterns), 1),
            "patterns": successful_patterns
        }
    
    async def _heuristic_routing_with_context(self, 
                                            request: Dict[str, Any], 
                                            rag_context: Dict[str, Any]) -> Dict[str, Any]:
        """Enhanced heuristic routing using RAG context"""
        
        message = request.get("message", "")
        
        # Base heuristics (from your original fallback_routing)
        routing = self._fallback_routing(request)
        
        # Enhance with RAG context
        if len(rag_context.get("memories", [])) > 5:
            # Lots of memory context - prefer context masters
            if "context_master" not in routing["primary_model"]:
                routing["fallback_models"].insert(0, routing["primary_model"])
                routing["primary_model"] = "context_master_primary"
                routing["reasoning"] += " [Enhanced: Rich memory context detected]"
        
        if rag_context.get("complexity_indicators", 0) > 3:
            # Complex patterns detected - prefer thinking models
            if "thinking" not in routing["primary_model"]:
                routing["fallback_models"].insert(0, routing["primary_model"])
                routing["primary_model"] = "deep_thinker_primary"
                routing["reasoning"] += " [Enhanced: Complex patterns detected]"
        
        routing["enhanced_by_rag"] = True
        routing["routing_confidence"] = 0.7  # Medium confidence for heuristics
        
        return routing
    
    def _generate_pattern_key(self, message: str) -> str:
        """Generate a key for pattern matching"""
        
        # Simple pattern key based on request characteristics
        words = message.lower().split()
        
        # Extract key terms
        key_terms = []
        important_words = [
            "create", "generate", "analyze", "debug", "explain", "help",
            "code", "function", "api", "data", "design", "build"
        ]
        
        for word in words:
            if word in important_words:
                key_terms.append(word)
        
        # Fallback to first few words if no key terms
        if not key_terms:
            key_terms = words[:3]
        
        return "_".join(key_terms[:3])  # Max 3 terms
    
    def _get_user_preferred_models(self, user_id: str) -> List[str]:
        """Get user's preferred models based on usage patterns"""
        
        if user_id not in self.user_preferences:
            return []
        
        model_usage = self.user_preferences[user_id]["model_usage"]
        
        # Sort by usage count
        preferred = sorted(model_usage.keys(), key=lambda x: model_usage[x], reverse=True)
        
        return preferred[:3]  # Top 3 preferred models
    
    def _detect_neurodivergent_needs(self, rag_context: Dict[str, Any]) -> bool:
        """Detect if user has neurodivergent needs based on context"""
        
        # Check memory for neurodivergent indicators
        memories = rag_context.get("memories", [])
        
        neurodivergent_indicators = [
            "adhd", "autism", "neurodivergent", "overwhelmed", "confused",
            "step by step", "simple", "clear", "gentle"
        ]
        
        for memory in memories:
            memory_content = str(memory).lower()
            if any(indicator in memory_content for indicator in neurodivergent_indicators):
                return True
        
        return False
    
    async def enable_predictive_routing(self, enable: bool = True) -> None:
        """Enable/disable predictive routing"""
        
        self.agentic_mode = enable
        
        if enable and self.rag_orchestrator:
            logger.info("🧠 Agentic routing enabled with RAG integration")
        elif enable:
            logger.info("🧠 Agentic routing enabled (RAG not available)")
        else:
            logger.info("🧠 Agentic routing disabled")
    
    async def get_agentic_analytics(self) -> Dict[str, Any]:
        """Get analytics on agentic routing performance"""
        
        total_patterns = sum(len(patterns) for patterns in self.routing_memory.values())
        
        analytics = {
            "agentic_mode": self.agentic_mode,
            "rag_integration": self.rag_orchestrator is not None,
            "total_routing_patterns": total_patterns,
            "unique_pattern_types": len(self.routing_memory),
            "users_with_preferences": len(self.user_preferences),
            "most_common_patterns": self._get_most_common_patterns(),
            "model_usage_stats": self._get_model_usage_stats()
        }
        
        return analytics
    
    def _get_most_common_patterns(self) -> List[Dict[str, Any]]:
        """Get most common routing patterns"""
        
        pattern_counts = {
            pattern_key: len(patterns) 
            for pattern_key, patterns in self.routing_memory.items()
        }
        
        # Sort by frequency
        common_patterns = sorted(pattern_counts.items(), key=lambda x: x[1], reverse=True)
        
        return [
            {"pattern": pattern, "count": count}
            for pattern, count in common_patterns[:5]
        ]
    
    def _get_model_usage_stats(self) -> Dict[str, int]:
        """Get overall model usage statistics"""
        
        model_stats = {}
        
        for user_prefs in self.user_preferences.values():
            for model, count in user_prefs["model_usage"].items():
                model_stats[model] = model_stats.get(model, 0) + count
        
        return model_stats
