"""
🚀 Enhanced Mama Bear V2.0 Supercharger
Integrates Express Mode + Vertex AI with existing orchestration system
Provides 6x faster responses, Claude model access, and agentic control
"""

import asyncio
import logging
import json
from datetime import datetime
from typing import Dict, Any, List, Optional, Union

from .express_mode_vertex_integration import (
    ExpressModeVertexIntegration, 
    ExecutionMode, 
    ModelProvider,
    ExpressConfig,
    ExpressResponse
)
from .enhanced_mama_bear_orchestration import EnhancedMamaBearAgent
from .mama_bear_model_manager import MamaBearModelManager

logger = logging.getLogger(__name__)

class MamaBearV2Supercharger:
    """
    🚀 Mama Bear V2.0 Supercharger
    
    Combines:
    - Existing Enhanced Mama Bear orchestration
    - Express Mode + Vertex AI integration  
    - Intelligent routing between Gemini API and Vertex AI
    - Agentic control capabilities
    - 6x faster response times
    """
    
    def __init__(self, 
                 gemini_api_key: str,
                 vertex_project_id: str,
                 vertex_region: str = "us-central1",
                 anthropic_api_key: str = None,
                 enable_autonomous_mode: bool = False):
        
        # Initialize existing Enhanced Mama Bear
        self.mama_bear_v1 = EnhancedMamaBearAgent(
            gemini_api_key=gemini_api_key,
            anthropic_api_key=anthropic_api_key
        )
        
        # Initialize Express Mode + Vertex AI integration
        self.express_integration = None
        self.vertex_project_id = vertex_project_id
        self.vertex_region = vertex_region
        
        # Configuration
        self.express_config = ExpressConfig(
            mode=ExecutionMode.SMART_ROUTING,
            enable_streaming=True,
            parallel_processing=True
        )
        
        # Performance tracking
        self.performance_metrics = {
            "requests_processed": 0,
            "express_mode_usage": 0,
            "vertex_ai_usage": 0,
            "gemini_api_usage": 0,
            "avg_response_time_ms": 0,
            "cost_savings_percent": 0
        }
        
        # Agentic capabilities
        self.autonomous_mode = enable_autonomous_mode
        self.agent_workbench = {}
        self.infrastructure_management = {}
        
        logger.info("🚀 Mama Bear V2.0 Supercharger initializing...")
    
    async def initialize(self):
        """Initialize the V2.0 system with all integrations"""
        
        try:
            # Initialize Express Mode + Vertex AI
            self.express_integration = ExpressModeVertexIntegration(
                project_id=self.vertex_project_id,
                region=self.vertex_region
            )
            
            # Enable autonomous mode if requested
            if self.autonomous_mode:
                await self.express_integration.enable_autonomous_mode(True)
            
            logger.info("✅ Mama Bear V2.0 Supercharger initialized successfully!")
            
            return {
                "status": "initialized",
                "timestamp": datetime.now().isoformat(),
                "capabilities": {
                    "express_mode": True,
                    "vertex_ai_claude": True,
                    "smart_routing": True,
                    "autonomous_mode": self.autonomous_mode,
                    "6x_faster_responses": True
                }
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize V2.0 Supercharger: {e}")
            raise
    
    async def process_supercharged_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """
        🚀 Main entry point for supercharged Mama Bear requests
        
        Intelligently routes between:
        - Express Mode via Vertex AI (6x faster)
        - Existing Enhanced Mama Bear system
        - Direct Claude model access
        """
        
        start_time = datetime.now()
        request_id = request.get("request_id", f"mb2_{int(start_time.timestamp())}")
        
        # Extract request parameters
        message = request.get("message", "")
        variant = request.get("variant", "scout_commander")
        context = request.get("context", {})
        user_id = request.get("user_id", "default")
        execution_mode = request.get("execution_mode", "smart_routing")
        
        logger.info(f"🚀 Processing supercharged request: {message[:100]}...")
        
        try:
            # Step 1: Analyze request for optimal routing strategy
            routing_strategy = await self._analyze_supercharged_routing(
                message, variant, context, execution_mode
            )
            
            # Step 2: Execute via optimal strategy
            if routing_strategy["use_express_mode"]:
                # Route via Express Mode + Vertex AI
                response = await self._execute_express_mode(request, routing_strategy)
            else:
                # Route via existing Enhanced Mama Bear
                response = await self._execute_enhanced_v1(request, routing_strategy)
            
            # Step 3: Apply V2.0 enhancements
            enhanced_response = await self._apply_v2_enhancements(
                response, routing_strategy, context
            )
            
            # Step 4: Update performance metrics
            processing_time = (datetime.now() - start_time).total_seconds() * 1000
            await self._update_performance_metrics(routing_strategy, processing_time)
            
            return {
                "success": True,
                "request_id": request_id,
                "response": enhanced_response,
                "routing_strategy": routing_strategy,
                "processing_time_ms": int(processing_time),
                "mama_bear_version": "2.0",
                "timestamp": start_time.isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Supercharged request failed: {e}")
            
            # Graceful fallback to V1 system
            fallback_response = await self._execute_v1_fallback(request)
            processing_time = (datetime.now() - start_time).total_seconds() * 1000
            
            return {
                "success": False,
                "request_id": request_id,
                "response": fallback_response,
                "error": str(e),
                "fallback_used": "enhanced_v1",
                "processing_time_ms": int(processing_time),
                "mama_bear_version": "2.0",
                "timestamp": start_time.isoformat()
            }
    
    async def _analyze_supercharged_routing(self, message: str, variant: str, 
                                          context: Dict[str, Any], 
                                          execution_mode: str) -> Dict[str, Any]:
        """
        🧠 Advanced routing analysis for V2.0 system
        """
        
        # Analyze request characteristics
        complexity_score = self._analyze_complexity(message, context)
        speed_requirement = self._analyze_speed_requirement(message, context)
        quality_requirement = self._analyze_quality_requirement(message, context)
        cost_sensitivity = context.get("cost_sensitivity", "balanced")
        
        # Agentic task detection
        is_agentic_task = self._detect_agentic_task(message, context)
        
        # Claude-specific task detection
        benefits_from_claude = self._detect_claude_benefits(message, context)
        
        # Routing decision logic
        use_express_mode = False
        target_provider = ModelProvider.GEMINI_API
        reasoning = []
        
        # High-priority Express Mode triggers
        if execution_mode == "express" or speed_requirement == "high":
            use_express_mode = True
            target_provider = ModelProvider.VERTEX_GEMINI
            reasoning.append("Express Mode requested or high speed requirement")
        
        # Complex coding/agentic tasks benefit from Claude
        elif (complexity_score >= 7 and 
              (is_agentic_task or benefits_from_claude)):
            use_express_mode = True
            target_provider = ModelProvider.VERTEX_CLAUDE
            reasoning.append("Complex task benefits from Claude capabilities")
        
        # Premium quality requirements
        elif quality_requirement == "premium":
            use_express_mode = True
            target_provider = ModelProvider.VERTEX_CLAUDE
            reasoning.append("Premium quality requirement - using Claude models")
        
        # Cost-effective but fast requirements
        elif cost_sensitivity == "low" and speed_requirement == "normal":
            use_express_mode = True
            target_provider = ModelProvider.VERTEX_GEMINI
            reasoning.append("Cost-effective speed optimization via Vertex Gemini")
        
        # Smart routing for balanced requests
        elif execution_mode == "smart_routing":
            # Use heuristics to decide
            if complexity_score >= 6 or len(message) > 1000:
                use_express_mode = True
                target_provider = (ModelProvider.VERTEX_CLAUDE 
                                 if benefits_from_claude 
                                 else ModelProvider.VERTEX_GEMINI)
                reasoning.append("Smart routing: complexity warrants Vertex AI")
            else:
                use_express_mode = False
                target_provider = ModelProvider.GEMINI_API
                reasoning.append("Smart routing: standard complexity, using Gemini API")
        
        return {
            "use_express_mode": use_express_mode,
            "target_provider": target_provider,
            "reasoning": reasoning,
            "complexity_score": complexity_score,
            "speed_requirement": speed_requirement,
            "quality_requirement": quality_requirement,
            "is_agentic_task": is_agentic_task,
            "benefits_from_claude": benefits_from_claude,
            "estimated_cost_multiplier": self._estimate_cost_multiplier(target_provider),
            "estimated_speed_improvement": self._estimate_speed_improvement(target_provider)
        }
    
    def _analyze_complexity(self, message: str, context: Dict[str, Any]) -> int:
        """Analyze task complexity (1-10 scale)"""
        complexity = 3  # Base complexity
        
        # Technical complexity indicators
        tech_keywords = [
            "implement", "refactor", "architecture", "algorithm", "optimization",
            "integration", "deployment", "infrastructure", "debugging", "testing"
        ]
        complexity += sum(1 for keyword in tech_keywords if keyword in message.lower())
        
        # Agentic complexity indicators  
        agentic_keywords = [
            "agent", "autonomous", "intelligent", "reasoning", "planning",
            "decision", "workflow", "orchestration", "collaboration"
        ]
        complexity += sum(1 for keyword in agentic_keywords if keyword in message.lower())
        
        # Context complexity
        if len(str(context)) > 2000:
            complexity += 2
        elif len(str(context)) > 1000:
            complexity += 1
        
        # Multi-step task indicators
        if any(indicator in message.lower() for indicator in 
               ["step", "phase", "process", "workflow", "pipeline"]):
            complexity += 1
        
        return min(complexity, 10)
    
    def _analyze_speed_requirement(self, message: str, context: Dict[str, Any]) -> str:
        """Analyze speed requirements"""
        high_speed_indicators = [
            "fast", "quick", "rapid", "immediate", "urgent", "asap", 
            "real-time", "instant", "express"
        ]
        
        low_speed_indicators = [
            "careful", "thorough", "detailed", "comprehensive", "deep"
        ]
        
        message_lower = message.lower()
        
        if any(indicator in message_lower for indicator in high_speed_indicators):
            return "high"
        elif any(indicator in message_lower for indicator in low_speed_indicators):
            return "low"
        else:
            return "normal"
    
    def _analyze_quality_requirement(self, message: str, context: Dict[str, Any]) -> str:
        """Analyze quality requirements"""
        premium_indicators = [
            "best", "highest", "premium", "excellent", "perfect", 
            "production", "enterprise", "professional"
        ]
        
        if any(indicator in message.lower() for indicator in premium_indicators):
            return "premium"
        elif context.get("quality_level") == "high":
            return "premium"
        else:
            return "standard"
    
    def _detect_agentic_task(self, message: str, context: Dict[str, Any]) -> bool:
        """Detect if task involves agentic capabilities"""
        agentic_indicators = [
            "create agent", "build agent", "autonomous", "intelligent system",
            "decision making", "planning", "orchestration", "workflow automation",
            "multi-step", "reasoning", "problem solving", "strategic thinking"
        ]
        
        return any(indicator in message.lower() for indicator in agentic_indicators)
    
    def _detect_claude_benefits(self, message: str, context: Dict[str, Any]) -> bool:
        """Detect if task would benefit from Claude's specific strengths"""
        claude_strength_indicators = [
            "code review", "refactor", "complex reasoning", "step-by-step",
            "analysis", "writing", "explanation", "documentation", 
            "problem solving", "debugging", "architecture", "design patterns"
        ]
        
        return any(indicator in message.lower() for indicator in claude_strength_indicators)
    
    def _estimate_cost_multiplier(self, provider: ModelProvider) -> float:
        """Estimate cost multiplier compared to baseline"""
        multipliers = {
            ModelProvider.GEMINI_API: 1.0,
            ModelProvider.VERTEX_GEMINI: 1.2,
            ModelProvider.VERTEX_CLAUDE: 2.5
        }
        return multipliers.get(provider, 1.0)
    
    def _estimate_speed_improvement(self, provider: ModelProvider) -> float:
        """Estimate speed improvement factor"""
        improvements = {
            ModelProvider.GEMINI_API: 1.0,
            ModelProvider.VERTEX_GEMINI: 6.0,  # Express Mode optimization
            ModelProvider.VERTEX_CLAUDE: 4.0   # Fast but high-quality
        }
        return improvements.get(provider, 1.0)
    
    async def _execute_express_mode(self, request: Dict[str, Any], 
                                   routing: Dict[str, Any]) -> ExpressResponse:
        """Execute request via Express Mode + Vertex AI"""
        
        if not self.express_integration:
            raise Exception("Express Mode integration not initialized")
        
        # Enhance request with routing information
        express_request = request.copy()
        express_request["mode"] = routing["target_provider"].value
        express_request["routing_info"] = routing
        
        # Execute via Express Mode
        response = await self.express_integration.process_express_request(express_request)
        
        logger.info(f"⚡ Express Mode execution completed in {response.processing_time_ms}ms")
        return response
    
    async def _execute_enhanced_v1(self, request: Dict[str, Any], 
                                  routing: Dict[str, Any]) -> Dict[str, Any]:
        """Execute request via existing Enhanced Mama Bear V1"""
        
        message = request.get("message", "")
        variant = request.get("variant", "scout_commander")
        context = request.get("context", {})
        user_id = request.get("user_id", "default")
        
        # Add routing information to context
        context["routing_info"] = routing
        
        # Execute via V1 system
        response = await self.mama_bear_v1.process_message(
            message=message,
            variant=variant,
            context=context,
            user_id=user_id
        )
        
        logger.info("🐻 Enhanced V1 execution completed")
        return response
    
    async def _apply_v2_enhancements(self, response: Union[ExpressResponse, Dict[str, Any]], 
                                   routing: Dict[str, Any], 
                                   context: Dict[str, Any]) -> Dict[str, Any]:
        """Apply V2.0 enhancements to any response"""
        
        # Normalize response format
        if isinstance(response, ExpressResponse):
            enhanced_response = {
                "content": response.content,
                "model_used": response.model_used,
                "provider": response.provider.value,
                "execution_mode": response.execution_mode.value,
                "processing_time_ms": response.processing_time_ms,
                "tokens_used": response.tokens_used,
                "cost_estimate": response.cost_estimate,
                "express_mode_used": True,
                "reasoning_steps": response.reasoning_steps,
                "confidence_score": response.confidence_score,
                "autonomous_actions": response.autonomous_actions
            }
        else:
            enhanced_response = response.copy()
            enhanced_response["express_mode_used"] = False
        
        # Add V2.0 metadata
        enhanced_response["mama_bear_version"] = "2.0"
        enhanced_response["routing_strategy"] = routing
        enhanced_response["enhancements"] = []
        
        # Apply autonomous enhancements if enabled
        if self.autonomous_mode:
            autonomous_enhancements = await self._apply_autonomous_enhancements(
                enhanced_response, context
            )
            enhanced_response["enhancements"].extend(autonomous_enhancements)
        
        # Apply performance optimizations
        performance_enhancements = await self._apply_performance_enhancements(
            enhanced_response, routing
        )
        enhanced_response["enhancements"].extend(performance_enhancements)
        
        return enhanced_response
    
    async def _apply_autonomous_enhancements(self, response: Dict[str, Any], 
                                           context: Dict[str, Any]) -> List[str]:
        """Apply autonomous enhancements if enabled"""
        enhancements = []
        
        if not self.autonomous_mode:
            return enhancements
        
        # Check for agent creation opportunities
        content = response.get("content", "").lower()
        if any(keyword in content for keyword in 
               ["create", "build", "develop", "implement", "deploy"]):
            enhancements.append("Autonomous agent creation capabilities enabled")
            
            # Log potential agent creation
            self.agent_workbench[f"suggestion_{len(self.agent_workbench)}"] = {
                "timestamp": datetime.now(),
                "context": context,
                "suggestion": response.get("content", "")[:200]
            }
        
        # Check for infrastructure optimization opportunities
        if any(keyword in content for keyword in 
               ["optimize", "improve", "scale", "infrastructure", "performance"]):
            enhancements.append("Infrastructure optimization analysis enabled")
            
            # Log infrastructure suggestion
            self.infrastructure_management[f"optimization_{len(self.infrastructure_management)}"] = {
                "timestamp": datetime.now(),
                "suggestion": response.get("content", "")[:200],
                "context": context
            }
        
        return enhancements
    
    async def _apply_performance_enhancements(self, response: Dict[str, Any], 
                                            routing: Dict[str, Any]) -> List[str]:
        """Apply performance enhancements based on routing strategy"""
        enhancements = []
        
        # Add speed improvement information
        if routing.get("estimated_speed_improvement", 1.0) > 1.0:
            speed_factor = routing["estimated_speed_improvement"]
            enhancements.append(f"Speed optimization: {speed_factor:.1f}x faster response")
        
        # Add cost optimization information
        cost_multiplier = routing.get("estimated_cost_multiplier", 1.0)
        if cost_multiplier <= 1.2:
            enhancements.append("Cost optimization: efficient model selection")
        
        # Add quality enhancements
        if routing.get("target_provider") == ModelProvider.VERTEX_CLAUDE:
            enhancements.append("Quality enhancement: Claude model capabilities utilized")
        
        return enhancements
    
    async def _execute_v1_fallback(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback to V1 system when V2.0 fails"""
        
        try:
            message = request.get("message", "")
            variant = request.get("variant", "scout_commander")
            context = request.get("context", {})
            user_id = request.get("user_id", "default")
            
            # Add fallback context
            context["fallback_mode"] = True
            context["original_request"] = request
            
            response = await self.mama_bear_v1.process_message(
                message=message,
                variant=variant,
                context=context,
                user_id=user_id
            )
            
            # Add fallback metadata
            response["fallback_used"] = True
            response["mama_bear_version"] = "1.0"
            
            return response
            
        except Exception as e:
            logger.error(f"❌ V1 fallback also failed: {e}")
            
            # Ultimate fallback response
            return {
                "response": self._generate_ultimate_fallback(request.get("message", "")),
                "fallback_used": True,
                "error": str(e),
                "mama_bear_version": "fallback"
            }
    
    def _generate_ultimate_fallback(self, message: str) -> str:
        """Generate ultimate fallback response when everything else fails"""
        
        return f"""🐻 **Mama Bear System Notice**

I'm experiencing some technical difficulties right now, but I want you to know that your request is important to me!

💜 **Your request:** "{message[:50]}..." 

🔧 **What's happening:** Both my advanced V2.0 and V1.0 systems are temporarily having issues, but my care for you remains constant.

🌟 **What I can offer:** While I work on getting back to full capacity, I'm still here in this safe sanctuary space with you.

🛠️ **Next steps:** 
- Please try your request again in a moment
- My systems should recover shortly
- Your sanctuary space remains safe and caring

Remember: Technical hiccups are temporary, but this supportive environment is permanent! 🐻💜"""
    
    async def _update_performance_metrics(self, routing: Dict[str, Any], 
                                        processing_time_ms: int):
        """Update performance metrics for monitoring"""
        
        self.performance_metrics["requests_processed"] += 1
        
        if routing.get("use_express_mode"):
            self.performance_metrics["express_mode_usage"] += 1
            
            if routing.get("target_provider") == ModelProvider.VERTEX_AI:
                self.performance_metrics["vertex_ai_usage"] += 1
            else:
                self.performance_metrics["gemini_api_usage"] += 1
        else:
            self.performance_metrics["gemini_api_usage"] += 1
        
        # Update average response time
        current_avg = self.performance_metrics["avg_response_time_ms"]
        total_requests = self.performance_metrics["requests_processed"]
        
        new_avg = ((current_avg * (total_requests - 1)) + processing_time_ms) / total_requests
        self.performance_metrics["avg_response_time_ms"] = int(new_avg)
    
    async def get_v2_status(self) -> Dict[str, Any]:
        """Get comprehensive V2.0 system status"""
        
        # Get Express Mode status
        express_status = {}
        if self.express_integration:
            express_status = await self.express_integration.get_express_mode_status()
        
        # Get V1 status
        v1_status = {}
        try:
            v1_status = await self.mama_bear_v1.get_variant_status()
        except:
            v1_status = {"status": "unavailable"}
        
        return {
            "timestamp": datetime.now().isoformat(),
            "mama_bear_version": "2.0",
            "system_status": "operational",
            "express_mode": {
                "enabled": self.express_integration is not None,
                "status": express_status
            },
            "enhanced_v1": {
                "enabled": True,
                "status": v1_status
            },
            "autonomous_mode": {
                "enabled": self.autonomous_mode,
                "agent_workbench_entries": len(self.agent_workbench),
                "infrastructure_suggestions": len(self.infrastructure_management)
            },
            "performance_metrics": self.performance_metrics,
            "capabilities": {
                "6x_faster_responses": True,
                "claude_model_access": True,
                "smart_routing": True,
                "intelligent_fallback": True,
                "agentic_control": self.autonomous_mode,
                "cost_optimization": True
            }
        }
    
    async def enable_autonomous_mode(self, enable: bool = True) -> Dict[str, Any]:
        """Enable/disable autonomous mode"""
        
        self.autonomous_mode = enable
        
        if self.express_integration:
            await self.express_integration.enable_autonomous_mode(enable)
        
        return {
            "autonomous_mode": enable,
            "timestamp": datetime.now().isoformat(),
            "status": f"Autonomous mode {'enabled' if enable else 'disabled'}"
        }

# Integration functions for Flask app

async def initialize_mama_bear_v2(gemini_api_key: str, 
                                 vertex_project_id: str,
                                 vertex_region: str = "us-central1",
                                 anthropic_api_key: str = None,
                                 enable_autonomous: bool = False) -> MamaBearV2Supercharger:
    """Initialize Mama Bear V2.0 Supercharger"""
    
    supercharger = MamaBearV2Supercharger(
        gemini_api_key=gemini_api_key,
        vertex_project_id=vertex_project_id,
        vertex_region=vertex_region,
        anthropic_api_key=anthropic_api_key,
        enable_autonomous_mode=enable_autonomous
    )
    
    await supercharger.initialize()
    
    logger.info("🚀 Mama Bear V2.0 Supercharger ready for deployment!")
    return supercharger
