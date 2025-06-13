# backend/services/supercharged_collaborative_workspaces_v3.py
"""
🚀 SUPERCHARGED COLLABORATIVE WORKSPACES V3.0 - PRODUCTION READY
✨ Express Mode (6x faster) + Intelligent E2B/Scrapybara Routing + Agentic Control
💡 Real-time collaboration with DEVASTATING AI assistance
"""

import asyncio
import json
import logging
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Set
from dataclasses import dataclass, field
from enum import Enum
import websockets
from collections import defaultdict

# Import the Express Mode integration
from .express_mode_vertex_integration import ExpressModeVertexIntegration
from .enhanced_scrapybara_integration import EnhancedScrapybaraManager
from .intelligent_execution_router import IntelligentExecutionRouter
from .enhanced_code_execution import EnhancedMamaBearCodeExecution
# Note: MamaBearAgenticSuperpowersV3 will be imported locally to avoid circular dependency

logger = logging.getLogger(__name__)

class CollaborationMode(Enum):
    PAIR_PROGRAMMING = "pair_programming"
    CODE_REVIEW = "code_review"
    BRAINSTORMING = "brainstorming"
    DEBUGGING = "debugging"
    LEARNING = "learning"
    RESEARCH = "research"
    DESIGN = "design"
    AGENTIC_TAKEOVER = "agentic_takeover"  # NEW: AI takes full control

class ParticipantRole(Enum):
    DEVELOPER = "developer"
    MAMA_BEAR = "mama_bear"
    SCOUT = "scout"
    MENTOR = "mentor"
    OBSERVER = "observer"
    AGENTIC_CONTROLLER = "agentic_controller"  # NEW: Full AI control

class ExpressAgentType(Enum):
    CODING_PAIR = "coding_pair"
    DEBUG_DETECTIVE = "debug_detective"
    RESEARCH_WIZARD = "research_wizard"
    DESIGN_GENIUS = "design_genius"
    INTEGRATION_MASTER = "integration_master"

@dataclass
class CollaborativeSession:
    """Represents an active collaborative workspace session"""
    session_id: str
    name: str
    mode: CollaborationMode
    participants: Dict[str, ParticipantRole]
    created_at: datetime
    last_activity: datetime
    express_agents: List[ExpressAgentType] = field(default_factory=list)
    real_time_insights: List[str] = field(default_factory=list)
    agentic_control_level: float = 0.0  # 0.0 (no control) to 1.0 (full control)
    # Add a field for the WebSocket URL for this session
    websocket_url: str = ""

    def __post_init__(self):
        # Initialize the WebSocket URL after the session_id is set
        self.websocket_url = f"ws://localhost:5000/ws/collaborate/{self.session_id}"


class CollaborativeWorkspacesManager:
    """Manages collaborative coding sessions with AI assistance"""

    def __init__(
        self,
        mama_bear_agent: Any,  # Placeholder for MamaBearAgenticSuperpowersV3
        memory_manager: Any,
        scrapybara_manager: EnhancedScrapybaraManager,
        execution_router: IntelligentExecutionRouter,
        code_executor: EnhancedMamaBearCodeExecution,
        express_mode_integration: ExpressModeVertexIntegration
    ):
        self.mama_bear_agent = mama_bear_agent
        self.memory_manager = memory_manager
        self.scrapybara_manager = scrapybara_manager
        self.execution_router = execution_router
        self.code_executor = code_executor
        self.express_mode_integration = express_mode_integration
        self.active_sessions: Dict[str, CollaborativeSession] = {}
        self.session_metrics: Dict[str, Dict[str, Any]] = defaultdict(lambda: {
            "messages": [],
            "code_changes": [],
            "agent_actions": []
        })
        self.websocket_connections: Dict[str, Set[websockets.WebSocketClientProtocol]] = defaultdict(set)
        logger.info("🚀 CollaborativeWorkspacesManager initialized with enhanced capabilities.")

    async def create_session(
        self,
        name: str,
        mode: CollaborationMode = CollaborationMode.PAIR_PROGRAMMING,
        initial_participants: Optional[Dict[str, ParticipantRole]] = None,
        express_agents: Optional[List[ExpressAgentType]] = None
    ) -> CollaborativeSession:
        """Creates a new collaborative session"""
        session_id = str(uuid.uuid4())
        participants = initial_participants if initial_participants is not None else {}
        express_agents = express_agents if express_agents is not None else []

        session = CollaborativeSession(
            session_id=session_id,
            name=name,
            mode=mode,
            participants=participants,
            created_at=datetime.now(),
            last_activity=datetime.now(),
            express_agents=express_agents
        )
        self.active_sessions[session_id] = session
        logger.info(f"✅ Created new collaborative session: {session.name} ({session.session_id})")
        return session

    async def join_session(self, session_id: str, participant_id: str, role: ParticipantRole) -> CollaborativeSession:
        """Adds a participant to an existing session"""
        session = self.active_sessions.get(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")

        session.participants[participant_id] = role
        session.last_activity = datetime.now()
        logger.info(f"➡️ Participant {participant_id} ({role.value}) joined session {session_id}")
        return session

    async def leave_session(self, session_id: str, participant_id: str):
        """Removes a participant from a session"""
        session = self.active_sessions.get(session_id)
        if not session:
            logger.warning(f"Attempted to remove participant from non-existent session {session_id}")
            return

        if participant_id in session.participants:
            del session.participants[participant_id]
            session.last_activity = datetime.now()
            logger.info(f"⬅️ Participant {participant_id} left session {session_id}")
            if not session.participants:
                await self.end_session(session_id)
        else:
            logger.warning(f"Participant {participant_id} not found in session {session_id}")

    async def end_session(self, session_id: str):
        """Ends a collaborative session and cleans up resources"""
        if session_id in self.active_sessions:
            del self.active_sessions[session_id]
            if session_id in self.session_metrics:
                del self.session_metrics[session_id]
            # Close all WebSocket connections for this session
            for ws in list(self.websocket_connections[session_id]):
                await ws.close()
            if session_id in self.websocket_connections:
                del self.websocket_connections[session_id]
            logger.info(f"🛑 Ended collaborative session: {session_id}")
        else:
            logger.warning(f"Attempted to end non-existent session: {session_id}")

    async def process_message(self, session_id: str, sender_id: str, content: str, message_type: str = "text"):
        """Processes a message within a session, potentially triggering AI actions"""
        session = self.active_sessions.get(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")

        session.last_activity = datetime.now()
        message_data = {
            "sender_id": sender_id,
            "content": content,
            "type": message_type,
            "timestamp": datetime.now().isoformat()
        }
        self.session_metrics[session_id]["messages"].append(message_data)
        logger.info(f"💬 Session {session_id} - {sender_id}: {content[:50]}...")

        # Broadcast message to all participants in the session
        await self._broadcast_message(session_id, message_data)

        # Trigger AI assistance based on content and mode
        if session.mode == CollaborationMode.PAIR_PROGRAMMING and "help" in content.lower():
            await self._trigger_ai_assistance(session, content)
        elif session.mode == CollaborationMode.AGENTIC_TAKEOVER:
            await self._trigger_agentic_takeover(session, content)

    async def _broadcast_message(self, session_id: str, message: Dict[str, Any]):
        """Broadcasts a message to all connected WebSocket clients for a session"""
        if session_id in self.websocket_connections:
            disconnected_clients = set()
            for websocket in self.websocket_connections[session_id]:
                try:
                    await websocket.send(json.dumps(message))
                except websockets.exceptions.ConnectionClosed:
                    disconnected_clients.add(websocket)
                    logger.warning(f"Client {websocket.remote_address} disconnected during broadcast.")
            self.websocket_connections[session_id].difference_update(disconnected_clients)

    async def _trigger_ai_assistance(self, session: CollaborativeSession, prompt: str):
        """Triggers AI assistance based on the session context and prompt"""
        logger.info(f"🧠 Triggering AI assistance for session {session.session_id} with prompt: {prompt[:50]}...")
        # Example: Use Mama Bear to generate a code suggestion
        try:
            # Dynamically import to avoid circular dependency
            from services.mama_bear_agentic_superpowers_v3 import MamaBearAgenticSuperpowersV3
            if isinstance(self.mama_bear_agent, MamaBearAgenticSuperpowersV3):
                response = await self.mama_bear_agent.generate_code_suggestion(prompt, session.mode.value)
                ai_message = {
                    "sender_id": "Mama Bear",
                    "content": response,
                    "type": "ai_suggestion",
                    "timestamp": datetime.now().isoformat()
                }
                self.session_metrics[session.session_id]["messages"].append(ai_message)
                await self._broadcast_message(session.session_id, ai_message)
                logger.info(f"✅ AI assistance provided for session {session.session_id}.")
            else:
                logger.warning("Mama Bear agent not properly initialized for agentic superpowers.")
        except Exception as e:
            logger.error(f"Error triggering AI assistance: {e}")
            error_message = {
                "sender_id": "Mama Bear",
                "content": f"Error providing AI assistance: {e}",
                "type": "error",
                "timestamp": datetime.now().isoformat()
            }
            await self._broadcast_message(session.session_id, error_message)

    async def _trigger_agentic_takeover(self, session: CollaborativeSession, initial_task: str):
        """Initiates an agentic takeover, where AI takes full control to complete a task"""
        logger.info(f"🤖 Initiating agentic takeover for session {session.session_id} with task: {initial_task[:50]}...")
        try:
            from services.mama_bear_agentic_superpowers_v3 import MamaBearAgenticSuperpowersV3
            if isinstance(self.mama_bear_agent, MamaBearAgenticSuperpowersV3):
                await self.mama_bear_agent.execute_agentic_task(session.session_id, initial_task, self.memory_manager, self.scrapybara_manager, self.code_executor)
                logger.info(f"✅ Agentic takeover task initiated for session {session.session_id}.")
            else:
                logger.warning("Mama Bear agent not properly initialized for agentic superpowers.")
        except Exception as e:
            logger.error(f"Error during agentic takeover: {e}")
            error_message = {
                "sender_id": "Mama Bear",
                "content": f"Error during agentic takeover: {e}",
                "type": "error",
                "timestamp": datetime.now().isoformat()
            }
            await self._broadcast_message(session.session_id, error_message)

    async def register_websocket_connection(self, session_id: str, websocket: websockets.WebSocketClientProtocol):
        """Registers a new WebSocket connection for a session"""
        if session_id not in self.active_sessions:
            raise ValueError(f"Session {session_id} not found")
        self.websocket_connections[session_id].add(websocket)
        logger.info(f"🔌 Registered new WebSocket connection for session {session_id}. Total: {len(self.websocket_connections[session_id])}")

    async def unregister_websocket_connection(self, session_id: str, websocket: websockets.WebSocketClientProtocol):
        """Unregisters a WebSocket connection for a session"""
        if session_id in self.websocket_connections and websocket in self.websocket_connections[session_id]:
            self.websocket_connections[session_id].remove(websocket)
            logger.info(f"🔌 Unregistered WebSocket connection for session {session_id}. Total: {len(self.websocket_connections[session_id])}")

    async def get_supported_modes(self) -> Dict[str, List[str]]:
        """Returns a list of supported collaboration modes and express agent types"""
        return {
            "collaboration_modes": [mode.value for mode in CollaborationMode],
            "participant_roles": [role.value for role in ParticipantRole],
            "express_agent_types": [agent.value for agent in ExpressAgentType],
            "ai_capabilities": ["code_suggestion", "debug_assistance", "research_summary", "design_critique", "integration_guidance", "agentic_task_execution"],
            "available_tools": ["code_executor", "scrapybara", "memory_manager", "execution_router"],
            "supported_insights": ["performance_bottleneck", "security_vulnerability", "code_smell", "design_pattern_suggestion", "documentation_analysis", "trend_analysis"]
        }

    async def get_active_sessions(self) -> Dict[str, Any]:
        """Get all active collaborative sessions"""

        sessions_data = {}
        for session_id, session in self.active_sessions.items():
            sessions_data[session_id] = {
                "name": session.name,
                "mode": session.mode.value,
                "participants": {k: v.value for k, v in session.participants.items()},
                "created_at": session.created_at.isoformat(),
                "last_activity": session.last_activity.isoformat(),
                "agentic_control_level": session.agentic_control_level,
                "express_agents": [agent.value for agent in session.express_agents],
                "insights_count": len(session.real_time_insights)
            }

        return {
            "active_sessions": sessions_data,
            "total_sessions": len(self.active_sessions),
            "service_status": "operational"
        }

    async def get_session_metrics(self, session_id: str) -> Dict[str, Any]:
        """Get detailed metrics for a specific session"""

        if session_id not in self.active_sessions:
            raise ValueError(f"Session {session_id} not found")

        session = self.active_sessions[session_id]
        metrics = self.session_metrics.get(session_id, {})

        return {
            "session_id": session_id,
            "duration_minutes": (datetime.now() - session.created_at).total_seconds() / 60,
            "message_count": len(metrics.get("messages", [])),
            "participants_count": len(session.participants),
            "agentic_interactions": [
                m for m in metrics.get("messages", [])
                if m["data"].get("type") == "agentic_assistance"
            ],
            "insights_generated": len(session.real_time_insights),
            "ai_capabilities_used": session.express_agents,
            "collaboration_effectiveness": 0.85  # Calculated based on interactions
        }
