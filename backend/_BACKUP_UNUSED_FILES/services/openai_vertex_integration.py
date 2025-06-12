"""
🤖🐻 OpenAI + Vertex AI Integration for Mama Bear
Supports both Vertex AI Model Garden and direct OpenAI API calls
"""

import asyncio
import logging
import time
import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional, Union
from dataclasses import dataclass

import aiohttp
import vertexai
from google.cloud import aiplatform
from vertexai.generative_models import GenerativeModel
import openai

logger = logging.getLogger(__name__)

@dataclass
class OpenAIModelConfig:
    """Configuration for OpenAI models"""
    model_name: str
    max_tokens: int
    temperature: float
    vertex_endpoint: Optional[str] = None
    direct_api: bool = True
    cost_per_1k_tokens: float = 0.002

class OpenAIVertexIntegration:
    """
    🤖🐻 OpenAI + Vertex AI Integration

    Supports two modes:
    1. Vertex AI Model Garden (uses Google Cloud auth)
    2. Direct OpenAI API (uses OpenAI API key)
    """

    def __init__(self, config: Dict[str, Any]):
        """
        Initialize OpenAI + Vertex AI integration

        Args:
            config: Configuration with keys:
                - google_cloud_project: GCP project ID
                - vertex_ai_location: Vertex AI region
                - openai_api_key: OpenAI API key (for direct calls)
                - prefer_vertex: Whether to prefer Vertex AI over direct API
        """

        self.project_id = config['google_cloud_project']
        self.region = config.get('vertex_ai_location', 'us-central1')
        self.openai_api_key = config.get('openai_api_key')
        self.prefer_vertex = config.get('prefer_vertex', True)

        # OpenAI Model Configuration
        self.openai_models = {
            # GPT-4 Models
            "gpt-4": OpenAIModelConfig(
                model_name="gpt-4",
                max_tokens=8192,
                temperature=0.7,
                vertex_endpoint=f"projects/{self.project_id}/locations/{self.region}/publishers/openai/models/gpt-4",
                cost_per_1k_tokens=0.03
            ),
            "gpt-4-turbo": OpenAIModelConfig(
                model_name="gpt-4-turbo",
                max_tokens=4096,
                temperature=0.7,
                vertex_endpoint=f"projects/{self.project_id}/locations/{self.region}/publishers/openai/models/gpt-4-turbo",
                cost_per_1k_tokens=0.01
            ),
            "gpt-4o": OpenAIModelConfig(
                model_name="gpt-4o",
                max_tokens=4096,
                temperature=0.7,
                vertex_endpoint=f"projects/{self.project_id}/locations/{self.region}/publishers/openai/models/gpt-4o",
                cost_per_1k_tokens=0.005
            ),
            "gpt-4o-mini": OpenAIModelConfig(
                model_name="gpt-4o-mini",
                max_tokens=16384,
                temperature=0.7,
                vertex_endpoint=f"projects/{self.project_id}/locations/{self.region}/publishers/openai/models/gpt-4o-mini",
                cost_per_1k_tokens=0.00015
            ),

            # GPT-3.5 Models
            "gpt-3.5-turbo": OpenAIModelConfig(
                model_name="gpt-3.5-turbo",
                max_tokens=4096,
                temperature=0.7,
                vertex_endpoint=f"projects/{self.project_id}/locations/{self.region}/publishers/openai/models/gpt-3.5-turbo",
                cost_per_1k_tokens=0.0015
            ),

            # O1 Models (Reasoning)
            "o1-preview": OpenAIModelConfig(
                model_name="o1-preview",
                max_tokens=32768,
                temperature=1.0,  # Fixed for O1 models
                vertex_endpoint=f"projects/{self.project_id}/locations/{self.region}/publishers/openai/models/o1-preview",
                cost_per_1k_tokens=0.015
            ),
            "o1-mini": OpenAIModelConfig(
                model_name="o1-mini",
                max_tokens=65536,
                temperature=1.0,  # Fixed for O1 models
                vertex_endpoint=f"projects/{self.project_id}/locations/{self.region}/publishers/openai/models/o1-mini",
                cost_per_1k_tokens=0.003
            )
        }

        self.vertex_client = None
        self.openai_client = None

    async def initialize(self):
        """Initialize both Vertex AI and OpenAI clients"""

        try:
            # Initialize Vertex AI
            vertexai.init(project=self.project_id, location=self.region)
            logger.info(f"🌟 Vertex AI initialized: {self.project_id} @ {self.region}")

            # Initialize OpenAI client if API key provided
            if self.openai_api_key:
                self.openai_client = openai.AsyncOpenAI(api_key=self.openai_api_key)
                logger.info("🤖 OpenAI client initialized with API key")
            else:
                logger.warning("⚠️ No OpenAI API key provided - Vertex AI only mode")

            logger.info("🐻🤖 OpenAI + Vertex AI integration initialized!")

        except Exception as e:
            logger.error(f"Failed to initialize OpenAI + Vertex AI integration: {e}")
            raise

    async def call_openai_via_vertex(self, model_name: str, prompt: str, **kwargs) -> Dict[str, Any]:
        """
        Call OpenAI model via Vertex AI Model Garden
        Uses Google Cloud authentication, not OpenAI API key
        """

        try:
            if model_name not in self.openai_models:
                raise ValueError(f"Model {model_name} not configured for Vertex AI")

            model_config = self.openai_models[model_name]

            # Create Vertex AI model instance
            model = GenerativeModel(model_config.vertex_endpoint)

            # Generate content via Vertex AI
            start_time = time.time()
            response = await model.generate_content_async(
                prompt,
                generation_config={
                    "temperature": kwargs.get('temperature', model_config.temperature),
                    "max_output_tokens": kwargs.get('max_tokens', model_config.max_tokens),
                    "top_p": kwargs.get('top_p', 0.95),
                }
            )

            response_time = (time.time() - start_time) * 1000

            return {
                'success': True,
                'response': response.text,
                'model_used': model_name,
                'routing_method': 'vertex_ai_model_garden',
                'response_time_ms': response_time,
                'cost_estimation': self._estimate_cost(model_name, len(prompt), len(response.text)),
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Vertex AI OpenAI call failed for {model_name}: {e}")
            return {
                'success': False,
                'error': str(e),
                'model_attempted': model_name,
                'routing_method': 'vertex_ai_model_garden'
            }

    async def call_openai_direct(self, model_name: str, prompt: str, **kwargs) -> Dict[str, Any]:
        """
        Call OpenAI directly using OpenAI API key
        """

        try:
            if not self.openai_client:
                raise ValueError("OpenAI client not initialized - API key required")

            if model_name not in self.openai_models:
                raise ValueError(f"Model {model_name} not configured")

            model_config = self.openai_models[model_name]

            # Prepare messages for chat completion
            messages = [{"role": "user", "content": prompt}]

            # Handle O1 models differently (they don't support temperature/top_p)
            if model_name.startswith('o1-'):
                completion_kwargs = {
                    "model": model_name,
                    "messages": messages,
                    "max_completion_tokens": kwargs.get('max_tokens', model_config.max_tokens)
                }
            else:
                completion_kwargs = {
                    "model": model_name,
                    "messages": messages,
                    "max_tokens": kwargs.get('max_tokens', model_config.max_tokens),
                    "temperature": kwargs.get('temperature', model_config.temperature),
                    "top_p": kwargs.get('top_p', 0.95)
                }

            # Make API call
            start_time = time.time()
            response = await self.openai_client.chat.completions.create(**completion_kwargs)
            response_time = (time.time() - start_time) * 1000

            response_text = response.choices[0].message.content

            return {
                'success': True,
                'response': response_text,
                'model_used': model_name,
                'routing_method': 'openai_direct_api',
                'response_time_ms': response_time,
                'usage': {
                    'prompt_tokens': response.usage.prompt_tokens,
                    'completion_tokens': response.usage.completion_tokens,
                    'total_tokens': response.usage.total_tokens
                },
                'cost_estimation': self._calculate_exact_cost(model_name, response.usage),
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Direct OpenAI call failed for {model_name}: {e}")
            return {
                'success': False,
                'error': str(e),
                'model_attempted': model_name,
                'routing_method': 'openai_direct_api'
            }

    async def smart_openai_call(self, model_name: str, prompt: str, **kwargs) -> Dict[str, Any]:
        """
        Smart routing between Vertex AI and direct OpenAI based on availability and preferences
        """

        try:
            # Try Vertex AI first if preferred and available
            if self.prefer_vertex:
                logger.info(f"🎯 Attempting {model_name} via Vertex AI Model Garden...")
                result = await self.call_openai_via_vertex(model_name, prompt, **kwargs)
                if result.get('success'):
                    return result
                else:
                    logger.warning(f"Vertex AI failed, falling back to direct OpenAI...")

            # Try direct OpenAI
            if self.openai_client:
                logger.info(f"🎯 Attempting {model_name} via direct OpenAI API...")
                result = await self.call_openai_direct(model_name, prompt, **kwargs)
                if result.get('success'):
                    return result

            # If we get here, both methods failed
            return {
                'success': False,
                'error': 'Both Vertex AI and direct OpenAI calls failed',
                'model_attempted': model_name,
                'routing_method': 'smart_routing_failed'
            }

        except Exception as e:
            logger.error(f"Smart OpenAI routing failed for {model_name}: {e}")
            return {
                'success': False,
                'error': str(e),
                'model_attempted': model_name,
                'routing_method': 'smart_routing_error'
            }

    def _estimate_cost(self, model_name: str, prompt_length: int, response_length: int) -> Dict[str, float]:
        """Estimate cost based on character count (rough approximation)"""

        model_config = self.openai_models.get(model_name)
        if not model_config:
            return {'estimated_cost': 0.0}

        # Rough estimation: ~4 characters per token
        estimated_tokens = (prompt_length + response_length) / 4
        estimated_cost = (estimated_tokens / 1000) * model_config.cost_per_1k_tokens

        return {
            'estimated_tokens': int(estimated_tokens),
            'estimated_cost_usd': round(estimated_cost, 6)
        }

    def _calculate_exact_cost(self, model_name: str, usage) -> Dict[str, float]:
        """Calculate exact cost from OpenAI usage data"""

        model_config = self.openai_models.get(model_name)
        if not model_config:
            return {'exact_cost': 0.0}

        total_tokens = usage.total_tokens
        exact_cost = (total_tokens / 1000) * model_config.cost_per_1k_tokens

        return {
            'exact_tokens': total_tokens,
            'exact_cost_usd': round(exact_cost, 6)
        }

    def get_available_models(self) -> List[str]:
        """Get list of available OpenAI models"""
        return list(self.openai_models.keys())

    def get_model_info(self, model_name: str) -> Dict[str, Any]:
        """Get detailed information about a specific model"""

        if model_name not in self.openai_models:
            return {'error': f'Model {model_name} not available'}

        config = self.openai_models[model_name]

        return {
            'model_name': config.model_name,
            'max_tokens': config.max_tokens,
            'temperature': config.temperature,
            'cost_per_1k_tokens': config.cost_per_1k_tokens,
            'vertex_available': config.vertex_endpoint is not None,
            'direct_api_available': self.openai_client is not None,
            'vertex_endpoint': config.vertex_endpoint
        }
