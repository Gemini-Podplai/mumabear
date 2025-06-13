# backend/services/mcp_agentic_rag_gemini_integration.py
"""
🧠 MCP + Agentic RAG Integration for Gemini Orchestra
Specifically designed for your 7 Gemini 2.5 models + Vertex Express setup
"""

import asyncio
import json
import logging
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Set, Tuple
from dataclasses import dataclass, field
from enum import Enum
import google.generativeai as genai
from collections import defaultdict, deque

# Import your existing services
from .orchestration.conductor import GeminiConductor
from .orchestration.orchestra_manager import GeminiOrchestra
from .orchestration.model_registry import GEMINI_REGISTRY, ModelCapability
from .mama_bear_memory_system import MemoryManager
from .enhanced_scrapybara_integration import EnhancedScrapybaraManager
from .intelligent_execution_router import IntelligentExecutionRouter

logger = logging.getLogger(__name__)

class AgenticRAGDecisionType(Enum):
    MEMORY_SEARCH = "memory_search"
    CONTEXT_EXPANSION = "context_expansion"
    MODEL_SELECTION = "model_selection"
    TOOL_ROUTING = "tool_routing"
    PROACTIVE_FETCH = "proactive_fetch"
    CROSS_SESSION_LEARNING = "cross_session_learning"

class RAGIntelligenceLevel(Enum):
    REACTIVE = 1      # Only responds to direct requests
    PROACTIVE = 2     # Anticipates needs
    PREDICTIVE = 3    # Predicts future context needs
    AUTONOMOUS = 4    # Makes independent decisions
    ORCHESTRATIVE = 5 # Coordinates across the entire orchestra

@dataclass
class AgenticRAGDecision:
    """Represents an autonomous RAG decision made by the system"""
    decision_id: str
    decision_type: AgenticRAGDecisionType
    trigger_context: Dict[str, Any]
    reasoning: str
    confidence_score: float
    selected_models: List[str]
    retrieved_context: Dict[str, Any]
    execution_plan: List[Dict[str, Any]]
    timestamp: datetime = field(default_factory=datetime.now)
    
    # Performance tracking
    execution_time_ms: Optional[float] = None
    success: Optional[bool] = None
    user_satisfaction: Optional[float] = None

@dataclass
class ContextualMemory:
    """Enhanced memory with agentic metadata"""
    memory_id: str
    content: str
    user_id: str
    context_tags: Set[str]
    emotional_context: Dict[str, Any]
    neurodivergent_considerations: Dict[str, Any]
    usage_patterns: Dict[str, int]
    relevance_scores: Dict[str, float]
    last_accessed: datetime
    access_count: int = 0

class MCPAgenticRAGOrchestrator:
    """
    🎼 MCP + Agentic RAG Orchestrator for Gemini Orchestra
    
    Supercharges your existing 7 Gemini models with:
    - Autonomous context retrieval and expansion
    - Intelligent cross-model memory sharing
    - Predictive context pre-fetching
    - Orchestra-level intelligence coordination
    - Neurodivergent-optimized information processing
    """
    
    def __init__(self, gemini_orchestra: GeminiOrchestra, config: Dict[str, Any]):
        self.orchestra = gemini_orchestra
        self.config = config
        
        # Enhanced memory system with agentic capabilities
        self.memory_manager = MemoryManager()
        self.contextual_memories: Dict[str, ContextualMemory] = {}
        
        # Agentic decision system
        self.intelligence_level = RAGIntelligenceLevel.AUTONOMOUS
        self.decision_history: deque = deque(maxlen=1000)
        self.learning_patterns: Dict[str, Dict[str, Any]] = defaultdict(dict)
        
        # Context analysis and prediction
        self.context_analyzer = ContextAnalyzer(self.orchestra)
        self.predictive_engine = PredictiveContextEngine()
        self.cross_session_learner = CrossSessionLearner()
        
        # Performance metrics
        self.rag_metrics = {
            "total_decisions": 0,
            "successful_predictions": 0,
            "context_cache_hits": 0,
            "average_response_improvement": 0.0,
            "user_satisfaction_scores": deque(maxlen=100)
        }
        
        # Integration with existing services
        self.scrapybara_manager = None
        self.execution_router = None
        
        logger.info("🧠 MCP + Agentic RAG Orchestrator initialized for Gemini Orchestra")
    
    async def initialize_integrations(self, scrapybara_manager, execution_router):
        """Initialize integrations with existing services"""
        self.scrapybara_manager = scrapybara_manager
        self.execution_router = execution_router
        
        # Pre-load critical context patterns
        await self._preload_context_patterns()
        
        logger.info("✅ Agentic RAG integrations initialized")
    
    async def process_agentic_request(self, 
                                    user_request: str,
                                    user_id: str,
                                    session_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        🚀 Main entry point for agentic RAG-enhanced request processing
        """
        
        start_time = datetime.now()
        request_id = str(uuid.uuid4())
        
        # Step 1: Analyze request and make agentic decisions
        rag_decisions = await self._make_agentic_rag_decisions(
            user_request, user_id, session_context or {}
        )
        
        # Step 2: Execute RAG decisions to gather enhanced context
        enhanced_context = await self._execute_rag_decisions(rag_decisions, user_id)
        
        # Step 3: Select optimal Gemini models based on context
        optimal_models = await self._select_optimal_models_with_context(
            user_request, enhanced_context, rag_decisions
        )
        
        # Step 4: Process with orchestra using enhanced context
        orchestra_request = {
            "message": user_request,
            "user_id": user_id,
            "enhanced_context": enhanced_context,
            "rag_decisions": rag_decisions,
            "optimal_models": optimal_models,
            "request_id": request_id
        }
        
        result = await self.orchestra.process_request(orchestra_request)
        
        # Step 5: Learn from the interaction
        await self._learn_from_interaction(rag_decisions, result, user_id)
        
        # Step 6: Proactively prepare for likely follow-up requests
        if self.intelligence_level.value >= RAGIntelligenceLevel.PREDICTIVE.value:
            asyncio.create_task(self._prepare_predictive_context(user_request, result, user_id))
        
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return {
            "response": result,
            "agentic_enhancements": {
                "rag_decisions_made": len(rag_decisions),
                "context_sources_used": len(enhanced_context),
                "models_optimized": optimal_models,
                "processing_time_ms": processing_time,
                "intelligence_level": self.intelligence_level.name
            }
        }
    
    async def _make_agentic_rag_decisions(self,
                                        user_request: str,
                                        user_id: str,
                                        session_context: Dict[str, Any]) -> List[AgenticRAGDecision]:
        """
        🧠 Make autonomous decisions about what context to retrieve and how
        """
        
        decisions = []
        
        # Decision 1: Memory Search Strategy
        memory_decision = await self._decide_memory_search_strategy(user_request, user_id)
        decisions.append(memory_decision)
        
        # Decision 2: Context Expansion Needs
        expansion_decision = await self._decide_context_expansion(user_request, session_context)
        decisions.append(expansion_decision)
        
        # Decision 3: Cross-Session Learning Application
        if self.intelligence_level.value >= RAGIntelligenceLevel.AUTONOMOUS.value:
            learning_decision = await self._decide_cross_session_learning(user_request, user_id)
            decisions.append(learning_decision)
        
        # Decision 4: Proactive Tool Routing
        tool_decision = await self._decide_tool_routing(user_request, session_context)
        decisions.append(tool_decision)
        
        return decisions
    
    async def _decide_memory_search_strategy(self, user_request: str, user_id: str) -> AgenticRAGDecision:
        """Decide how to search memory most effectively"""
        
        # Use your conductor to analyze the request
        analysis_prompt = f"""
        Analyze this user request for optimal memory search strategy:
        Request: "{user_request}"
        
        Determine:
        1. Should we search user's personal memories?
        2. Should we search system-wide patterns?
        3. Should we expand search with related concepts?
        4. What confidence level for memory relevance?
        
        Return strategy as: personal_search, system_search, expanded_search, confidence_threshold
        """
        
        try:
            conductor_analysis = await self.orchestra.conductor.conductor_model.generate_content_async(
                analysis_prompt
            )
            
            # Parse the response (simplified - you could enhance this)
            analysis_text = conductor_analysis.text.lower()
            
            strategy_components = {
                "personal_search": "personal" in analysis_text,
                "system_search": "system" in analysis_text,
                "expanded_search": "expand" in analysis_text,
                "confidence_threshold": 0.7 if "high" in analysis_text else 0.5
            }
            
            return AgenticRAGDecision(
                decision_id=str(uuid.uuid4()),
                decision_type=AgenticRAGDecisionType.MEMORY_SEARCH,
                trigger_context={"user_request": user_request, "user_id": user_id},
                reasoning=f"Memory search strategy based on request analysis: {strategy_components}",
                confidence_score=0.8,
                selected_models=["conductor"],
                retrieved_context={},
                execution_plan=[{
                    "action": "memory_search",
                    "strategy": strategy_components
                }]
            )
            
        except Exception as e:
            logger.error(f"Memory search decision failed: {e}")
            # Fallback decision
            return AgenticRAGDecision(
                decision_id=str(uuid.uuid4()),
                decision_type=AgenticRAGDecisionType.MEMORY_SEARCH,
                trigger_context={"user_request": user_request, "user_id": user_id},
                reasoning="Fallback: Standard personal memory search",
                confidence_score=0.6,
                selected_models=["conductor"],
                retrieved_context={},
                execution_plan=[{
                    "action": "memory_search",
                    "strategy": {"personal_search": True, "confidence_threshold": 0.5}
                }]
            )
    
    async def _decide_context_expansion(self, user_request: str, session_context: Dict[str, Any]) -> AgenticRAGDecision:
        """Decide if we need to expand context beyond immediate request"""
        
        # Analyze request complexity and session history
        request_complexity = len(user_request.split()) / 10  # Simple heuristic
        session_depth = len(session_context.get("conversation_history", []))
        
        should_expand = (
            request_complexity > 0.5 or  # Complex request
            session_depth > 3 or         # Deep conversation
            "related" in user_request.lower() or
            "also" in user_request.lower() or
            "additionally" in user_request.lower()
        )
        
        expansion_plan = []
        if should_expand:
            expansion_plan = [
                {"action": "search_related_concepts", "scope": "broad"},
                {"action": "fetch_user_preferences", "user_id": session_context.get("user_id")},
                {"action": "analyze_session_patterns", "session_data": session_context}
            ]
        
        return AgenticRAGDecision(
            decision_id=str(uuid.uuid4()),
            decision_type=AgenticRAGDecisionType.CONTEXT_EXPANSION,
            trigger_context={"request_complexity": request_complexity, "session_depth": session_depth},
            reasoning=f"Context expansion {'needed' if should_expand else 'not needed'} based on complexity and session depth",
            confidence_score=0.8 if should_expand else 0.9,
            selected_models=["context_master_primary"],
            retrieved_context={},
            execution_plan=expansion_plan
        )
    
    async def _decide_cross_session_learning(self, user_request: str, user_id: str) -> AgenticRAGDecision:
        """Decide how to apply learning from other sessions"""
        
        # Check if we have patterns from similar requests
        similar_patterns = await self._find_similar_request_patterns(user_request, user_id)
        
        learning_plan = []
        if similar_patterns:
            learning_plan = [
                {"action": "apply_successful_patterns", "patterns": similar_patterns},
                {"action": "avoid_previous_failures", "failures": similar_patterns.get("failures", [])},
                {"action": "adapt_to_user_preferences", "preferences": similar_patterns.get("preferences", {})}
            ]
        
        return AgenticRAGDecision(
            decision_id=str(uuid.uuid4()),
            decision_type=AgenticRAGDecisionType.CROSS_SESSION_LEARNING,
            trigger_context={"similar_patterns_found": len(similar_patterns) if similar_patterns else 0},
            reasoning=f"Found {len(similar_patterns) if similar_patterns else 0} similar patterns to apply",
            confidence_score=0.7,
            selected_models=["deep_thinker_primary"],
            retrieved_context=similar_patterns or {},
            execution_plan=learning_plan
        )
    
    async def _decide_tool_routing(self, user_request: str, session_context: Dict[str, Any]) -> AgenticRAGDecision:
        """Decide optimal tool routing based on request analysis"""
        
        routing_analysis = {
            "needs_web_search": any(term in user_request.lower() for term in ["search", "find", "latest", "current"]),
            "needs_code_execution": any(term in user_request.lower() for term in ["run", "execute", "code", "script"]),
            "needs_scrapybara": any(term in user_request.lower() for term in ["website", "scrape", "browse", "analyze page"]),
            "complexity_level": "high" if len(user_request.split()) > 20 else "medium" if len(user_request.split()) > 10 else "low"
        }
        
        routing_plan = []
        if routing_analysis["needs_web_search"]:
            routing_plan.append({"action": "web_search", "priority": "high"})
        if routing_analysis["needs_code_execution"]:
            routing_plan.append({"action": "code_execution", "safety_level": "high"})
        if routing_analysis["needs_scrapybara"]:
            routing_plan.append({"action": "scrapybara_analysis", "mode": "enhanced"})
        
        return AgenticRAGDecision(
            decision_id=str(uuid.uuid4()),
            decision_type=AgenticRAGDecisionType.TOOL_ROUTING,
            trigger_context=routing_analysis,
            reasoning=f"Tool routing based on request analysis: {routing_analysis}",
            confidence_score=0.85,
            selected_models=["speed_demon_primary"],  # Fast analysis
            retrieved_context={},
            execution_plan=routing_plan
        )
    
    async def _execute_rag_decisions(self, decisions: List[AgenticRAGDecision], user_id: str) -> Dict[str, Any]:
        """Execute all RAG decisions to gather enhanced context"""
        
        enhanced_context = {
            "memories": [],
            "expanded_context": {},
            "learned_patterns": {},
            "tool_preparations": {}
        }
        
        for decision in decisions:
            try:
                if decision.decision_type == AgenticRAGDecisionType.MEMORY_SEARCH:
                    memories = await self._execute_memory_search(decision, user_id)
                    enhanced_context["memories"].extend(memories)
                
                elif decision.decision_type == AgenticRAGDecisionType.CONTEXT_EXPANSION:
                    expanded = await self._execute_context_expansion(decision, user_id)
                    enhanced_context["expanded_context"].update(expanded)
                
                elif decision.decision_type == AgenticRAGDecisionType.CROSS_SESSION_LEARNING:
                    patterns = await self._execute_cross_session_learning(decision, user_id)
                    enhanced_context["learned_patterns"].update(patterns)
                
                elif decision.decision_type == AgenticRAGDecisionType.TOOL_ROUTING:
                    tools = await self._execute_tool_preparation(decision, user_id)
                    enhanced_context["tool_preparations"].update(tools)
                
                # Mark decision as executed
                decision.execution_time_ms = (datetime.now() - decision.timestamp).total_seconds() * 1000
                decision.success = True
                
            except Exception as e:
                logger.error(f"Failed to execute RAG decision {decision.decision_id}: {e}")
                decision.success = False
                decision.execution_time_ms = (datetime.now() - decision.timestamp).total_seconds() * 1000
        
        return enhanced_context
    
    async def _execute_memory_search(self, decision: AgenticRAGDecision, user_id: str) -> List[Dict[str, Any]]:
        """Execute memory search based on decision"""
        
        memories = []
        for plan_item in decision.execution_plan:
            if plan_item["action"] == "memory_search":
                strategy = plan_item.get("strategy", {})
                
                # Personal memory search
                if strategy.get("personal_search", False):
                    personal_memories = await self.memory_manager.search_user_memories(
                        user_id, 
                        decision.trigger_context.get("user_request", ""),
                        confidence_threshold=strategy.get("confidence_threshold", 0.5)
                    )
                    memories.extend(personal_memories)
                
                # System-wide pattern search
                if strategy.get("system_search", False):
                    system_memories = await self.memory_manager.search_system_patterns(
                        decision.trigger_context.get("user_request", ""),
                        limit=10
                    )
                    memories.extend(system_memories)
                
                # Expanded conceptual search
                if strategy.get("expanded_search", False):
                    expanded_memories = await self._search_related_concepts(
                        decision.trigger_context.get("user_request", ""),
                        user_id
                    )
                    memories.extend(expanded_memories)
        
        return memories
    
    async def _select_optimal_models_with_context(self,
                                                user_request: str,
                                                enhanced_context: Dict[str, Any],
                                                rag_decisions: List[AgenticRAGDecision]) -> List[str]:
        """Select optimal Gemini models based on enhanced context"""
        
        # Analyze context to determine model requirements
        context_analysis = {
            "context_size": len(str(enhanced_context)),
            "memory_richness": len(enhanced_context.get("memories", [])),
            "complexity_indicators": len(enhanced_context.get("learned_patterns", {})),
            "tool_requirements": len(enhanced_context.get("tool_preparations", {}))
        }
        
        # Select models based on context analysis
        selected_models = []
        
        # Large context requires context masters
        if context_analysis["context_size"] > 10000:
            selected_models.append("context_master_primary")
        
        # Rich memory patterns suggest deep thinking needed
        if context_analysis["memory_richness"] > 5:
            selected_models.append("deep_thinker_primary")
        
        # Complex patterns suggest creative solutions
        if context_analysis["complexity_indicators"] > 3:
            selected_models.append("creative_writer_primary")
        
        # Tool requirements suggest coordination needed
        if context_analysis["tool_requirements"] > 2:
            selected_models.append("conductor")
        
        # Default to speed demon for simple requests
        if not selected_models:
            selected_models.append("speed_demon_primary")
        
        return selected_models

class ContextAnalyzer:
    """Analyzes context for optimal model selection"""
    
    def __init__(self, orchestra: GeminiOrchestra):
        self.orchestra = orchestra
        self.context_patterns = {}
    
    async def analyze_context_requirements(self, request: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze what context is needed for optimal response"""
        
        return {
            "context_size_needed": len(request) * 2,  # Estimate
            "domain_expertise_required": self._extract_domains(request),
            "memory_depth_needed": self._assess_memory_depth(request),
            "creativity_level": self._assess_creativity_needs(request)
        }
    
    def _extract_domains(self, request: str) -> List[str]:
        """Extract domain expertise requirements"""
        domains = []
        
        domain_keywords = {
            "programming": ["code", "function", "api", "debug"],
            "research": ["find", "search", "analyze", "study"],
            "design": ["create", "design", "build", "make"],
            "analysis": ["analyze", "compare", "evaluate", "assess"]
        }
        
        request_lower = request.lower()
        for domain, keywords in domain_keywords.items():
            if any(keyword in request_lower for keyword in keywords):
                domains.append(domain)
        
        return domains
    
    def _assess_memory_depth(self, request: str) -> str:
        """Assess how much memory context is needed"""
        if any(word in request.lower() for word in ["remember", "previous", "before", "earlier"]):
            return "deep"
        elif any(word in request.lower() for word in ["context", "related", "similar"]):
            return "medium"
        else:
            return "shallow"
    
    def _assess_creativity_needs(self, request: str) -> str:
        """Assess creativity requirements"""
        if any(word in request.lower() for word in ["create", "generate", "design", "brainstorm"]):
            return "high"
        elif any(word in request.lower() for word in ["improve", "enhance", "optimize"]):
            return "medium"
        else:
            return "low"

class PredictiveContextEngine:
    """Predicts what context might be needed for future requests"""
    
    def __init__(self):
        self.prediction_patterns = defaultdict(list)
        self.context_cache = {}
    
    async def predict_next_context_needs(self, current_request: str, user_id: str) -> Dict[str, Any]:
        """Predict what context might be needed next"""
        
        # Analyze patterns from current request
        likely_followups = await self._predict_followup_requests(current_request)
        
        # Pre-fetch context for likely scenarios
        predicted_context = {}
        for followup in likely_followups:
            context_key = f"predicted_{followup['type']}"
            predicted_context[context_key] = await self._prefetch_context_for_scenario(followup, user_id)
        
        return predicted_context
    
    async def _predict_followup_requests(self, current_request: str) -> List[Dict[str, Any]]:
        """Predict likely followup requests"""
        
        followups = []
        request_lower = current_request.lower()
        
        # Common patterns
        if "create" in request_lower:
            followups.append({"type": "modify", "probability": 0.7})
            followups.append({"type": "test", "probability": 0.6})
        
        if "explain" in request_lower:
            followups.append({"type": "example", "probability": 0.8})
            followups.append({"type": "detailed_explanation", "probability": 0.5})
        
        if "debug" in request_lower:
            followups.append({"type": "fix", "probability": 0.9})
            followups.append({"type": "prevent_future", "probability": 0.4})
        
        return followups

class CrossSessionLearner:
    """Learns patterns across different user sessions"""
    
    def __init__(self):
        self.session_patterns = defaultdict(list)
        self.success_patterns = defaultdict(list)
        self.failure_patterns = defaultdict(list)
    
    async def learn_from_session(self, session_data: Dict[str, Any]) -> None:
        """Learn patterns from a completed session"""
        
        session_type = session_data.get("type", "general")
        success_indicators = session_data.get("success_indicators", {})
        
        # Store successful patterns
        if success_indicators.get("user_satisfaction", 0) > 0.8:
            self.success_patterns[session_type].append({
                "context_used": session_data.get("context_used", {}),
                "models_used": session_data.get("models_used", []),
                "response_time": session_data.get("response_time", 0),
                "user_feedback": success_indicators
            })
        
        # Store failure patterns to avoid
        elif success_indicators.get("user_satisfaction", 0) < 0.4:
            self.failure_patterns[session_type].append({
                "context_used": session_data.get("context_used", {}),
                "models_used": session_data.get("models_used", []),
                "error_indicators": session_data.get("error_indicators", {})
            })
    
    async def get_applicable_patterns(self, request_type: str, user_id: str) -> Dict[str, Any]:
        """Get patterns applicable to current request"""
        
        applicable_patterns = {
            "successful_approaches": self.success_patterns.get(request_type, []),
            "approaches_to_avoid": self.failure_patterns.get(request_type, []),
            "recommended_models": self._get_recommended_models(request_type),
            "optimal_context_size": self._get_optimal_context_size(request_type)
        }
        
        return applicable_patterns
    
    def _get_recommended_models(self, request_type: str) -> List[str]:
        """Get models that work best for this request type"""
        
        success_patterns = self.success_patterns.get(request_type, [])
        if not success_patterns:
            return ["conductor"]  # Default
        
        # Count model usage in successful patterns
        model_counts = defaultdict(int)
        for pattern in success_patterns:
            for model in pattern.get("models_used", []):
                model_counts[model] += 1
        
        # Return most successful models
        return sorted(model_counts.keys(), key=lambda x: model_counts[x], reverse=True)[:3]
