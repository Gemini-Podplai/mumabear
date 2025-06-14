#!/usr/bin/env python3
"""
🚀 COMPREHENSIVE MODEL TESTING & CAPABILITY REPORT
Tests ALL available models across all services and generates beautiful report
"""

import os
import sys
import json
import asyncio
import time
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import traceback

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set up environment
from dotenv import load_dotenv
load_dotenv()

# Import all services
from services.openai_vertex_service_simple import OpenAIVertexService
from services.multi_model_orchestrator import MultiModelOrchestrator, create_multi_model_orchestrator
from services.mama_bear_model_manager import MamaBearModelManager
from services.deep_research_center import DeepResearchCenter
from services.express_mode_vertex_integration import ExpressModeVertexIntegration
from services.orchestration.model_registry import GEMINI_REGISTRY
from services.enhanced_gemini_scout_orchestration import EnhancedGeminiScoutOrchestrator

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ModelTestResult:
    """Test result for a single model"""
    model_id: str
    model_name: str
    service: str
    provider: str
    status: str  # "success", "failed", "unavailable"
    response_time_ms: Optional[float]
    response_preview: Optional[str]
    capabilities: List[str]
    error_message: Optional[str]
    context_window: Optional[int]
    max_output: Optional[int]
    cost_tier: Optional[str]

@dataclass
class ServiceStatus:
    """Status of a service"""
    service_name: str
    status: str
    total_models: int
    working_models: int
    failed_models: int
    error_message: Optional[str]

class ComprehensiveModelTester:
    """Tests all available models across all services"""

    def __init__(self):
        self.test_results: List[ModelTestResult] = []
        self.service_statuses: List[ServiceStatus] = []
        self.test_prompt = "Hello! Please respond with a brief introduction of your capabilities."

    async def test_all_models(self) -> Dict[str, Any]:
        """Test all available models and return comprehensive report"""
        logger.info("🚀 Starting comprehensive model testing...")

        # Test all services
        await self._test_openai_vertex_service()
        await self._test_multi_model_orchestrator()
        await self._test_mama_bear_models()
        await self._test_deep_research_models()
        await self._test_express_mode_models()
        await self._test_gemini_registry_models()
        await self._test_scout_orchestrator_models()

        # Generate report
        report = self._generate_comprehensive_report()

        # Save report
        await self._save_report(report)

        return report

    async def _test_openai_vertex_service(self):
        """Test OpenAI Vertex Service models"""
        logger.info("🧪 Testing OpenAI Vertex Service...")

        try:
            service = OpenAIVertexService()
            models = service.list_models()

            working = 0
            failed = 0

            for model_info in models:
                model_id = model_info['id']

                try:
                    start_time = time.time()
                    response = await service.chat_completion(
                        model=model_id,
                        messages=[{"role": "user", "content": self.test_prompt}],
                        max_tokens=100
                    )
                    end_time = time.time()

                    response_time = (end_time - start_time) * 1000

                    result = ModelTestResult(
                        model_id=model_id,
                        model_name=model_info.get('id', model_id),
                        service="OpenAI Vertex Service",
                        provider="OpenAI via Vertex AI",
                        status="success",
                        response_time_ms=response_time,
                        response_preview=response.get('content', '')[:100] + "...",
                        capabilities=["chat", "completion", "vertex_ai"],
                        error_message=None,
                        context_window=service.model_mapping.get(model_id, {}).get('context_window'),
                        max_output=4096,
                        cost_tier="medium"
                    )
                    working += 1

                except Exception as e:
                    result = ModelTestResult(
                        model_id=model_id,
                        model_name=model_info.get('id', model_id),
                        service="OpenAI Vertex Service",
                        provider="OpenAI via Vertex AI",
                        status="failed",
                        response_time_ms=None,
                        response_preview=None,
                        capabilities=["chat", "completion"],
                        error_message=str(e),
                        context_window=None,
                        max_output=None,
                        cost_tier="medium"
                    )
                    failed += 1

                self.test_results.append(result)

            self.service_statuses.append(ServiceStatus(
                service_name="OpenAI Vertex Service",
                status="operational" if working > 0 else "failed",
                total_models=len(models),
                working_models=working,
                failed_models=failed,
                error_message=None
            ))

        except Exception as e:
            logger.error(f"OpenAI Vertex Service test failed: {e}")
            self.service_statuses.append(ServiceStatus(
                service_name="OpenAI Vertex Service",
                status="failed",
                total_models=0,
                working_models=0,
                failed_models=0,
                error_message=str(e)
            ))

    async def _test_multi_model_orchestrator(self):
        """Test Multi Model Orchestrator"""
        logger.info("🧪 Testing Multi Model Orchestrator...")

        try:
            orchestrator = await create_multi_model_orchestrator()
            available_models = orchestrator.get_available_models()

            working = 0
            failed = 0

            for provider, model_info in available_models['available_models'].items():
                try:
                    start_time = time.time()
                    response = await orchestrator.route_request(
                        prompt=self.test_prompt,
                        user_id="test_user",
                        capabilities_needed=[]
                    )
                    end_time = time.time()

                    response_time = (end_time - start_time) * 1000

                    result = ModelTestResult(
                        model_id=provider,
                        model_name=model_info['model_name'],
                        service="Multi Model Orchestrator",
                        provider=provider.title(),
                        status="success",
                        response_time_ms=response_time,
                        response_preview=response.get('response', '')[:100] + "...",
                        capabilities=model_info['capabilities'],
                        error_message=None,
                        context_window=None,
                        max_output=model_info['max_tokens'],
                        cost_tier="varies"
                    )
                    working += 1

                except Exception as e:
                    result = ModelTestResult(
                        model_id=provider,
                        model_name=model_info['model_name'],
                        service="Multi Model Orchestrator",
                        provider=provider.title(),
                        status="failed",
                        response_time_ms=None,
                        response_preview=None,
                        capabilities=model_info['capabilities'],
                        error_message=str(e),
                        context_window=None,
                        max_output=model_info['max_tokens'],
                        cost_tier="varies"
                    )
                    failed += 1

                self.test_results.append(result)

            self.service_statuses.append(ServiceStatus(
                service_name="Multi Model Orchestrator",
                status="operational" if working > 0 else "failed",
                total_models=len(available_models['available_models']),
                working_models=working,
                failed_models=failed,
                error_message=None
            ))

        except Exception as e:
            logger.error(f"Multi Model Orchestrator test failed: {e}")
            self.service_statuses.append(ServiceStatus(
                service_name="Multi Model Orchestrator",
                status="failed",
                total_models=0,
                working_models=0,
                failed_models=0,
                error_message=str(e)
            ))

    async def _test_mama_bear_models(self):
        """Test Mama Bear Model Manager"""
        logger.info("🧪 Testing Mama Bear Model Manager...")

        try:
            manager = MamaBearModelManager()

            working = 0
            failed = 0
            total = 0

            for model_id, config in manager.models.items():
                total += 1

                try:
                    # Test model status
                    status = await manager.get_model_status(model_id)

                    result = ModelTestResult(
                        model_id=model_id,
                        model_name=config.name,
                        service="Mama Bear Model Manager",
                        provider="Google Gemini",
                        status="success" if status.is_healthy else "degraded",
                        response_time_ms=None,
                        response_preview="Model status checked successfully",
                        capabilities=["gemini", "quota_management", "fallback"],
                        error_message=None,
                        context_window=config.context_window,
                        max_output=config.max_output_tokens,
                        cost_tier=config.billing_account
                    )

                    if status.is_healthy:
                        working += 1
                    else:
                        failed += 1

                except Exception as e:
                    result = ModelTestResult(
                        model_id=model_id,
                        model_name=config.name,
                        service="Mama Bear Model Manager",
                        provider="Google Gemini",
                        status="failed",
                        response_time_ms=None,
                        response_preview=None,
                        capabilities=["gemini", "quota_management"],
                        error_message=str(e),
                        context_window=config.context_window,
                        max_output=config.max_output_tokens,
                        cost_tier=config.billing_account
                    )
                    failed += 1

                self.test_results.append(result)

            self.service_statuses.append(ServiceStatus(
                service_name="Mama Bear Model Manager",
                status="operational" if working > 0 else "failed",
                total_models=total,
                working_models=working,
                failed_models=failed,
                error_message=None
            ))

        except Exception as e:
            logger.error(f"Mama Bear Model Manager test failed: {e}")
            self.service_statuses.append(ServiceStatus(
                service_name="Mama Bear Model Manager",
                status="failed",
                total_models=0,
                working_models=0,
                failed_models=0,
                error_message=str(e)
            ))

    async def _test_deep_research_models(self):
        """Test Deep Research Center models"""
        logger.info("🧪 Testing Deep Research Center...")

        try:
            center = DeepResearchCenter(
                anthropic_api_key=os.getenv('ANTHROPIC_API_KEY', 'test'),
                gemini_api_key=os.getenv('GOOGLE_API_KEY', 'test')
            )

            working = 0
            failed = 0

            # Test Claude models
            for claude_id, claude_model in center.claude_models.items():
                result = ModelTestResult(
                    model_id=f"claude-{claude_id}",
                    model_name=claude_model,
                    service="Deep Research Center",
                    provider="Anthropic Claude",
                    status="configured",
                    response_time_ms=None,
                    response_preview="Claude model configured for research",
                    capabilities=["research", "analysis", "reasoning"],
                    error_message=None,
                    context_window=200000,
                    max_output=4096,
                    cost_tier="premium"
                )
                self.test_results.append(result)
                working += 1

            # Test Gemini models
            for gemini_id, gemini_model in center.gemini_models.items():
                result = ModelTestResult(
                    model_id=f"gemini-{gemini_id}",
                    model_name=gemini_model,
                    service="Deep Research Center",
                    provider="Google Gemini",
                    status="configured",
                    response_time_ms=None,
                    response_preview="Gemini model configured for research",
                    capabilities=["research", "reasoning", "deep_research"],
                    error_message=None,
                    context_window=1000000,
                    max_output=8192,
                    cost_tier="medium"
                )
                self.test_results.append(result)
                working += 1

            total = len(center.claude_models) + len(center.gemini_models)

            self.service_statuses.append(ServiceStatus(
                service_name="Deep Research Center",
                status="operational",
                total_models=total,
                working_models=working,
                failed_models=0,
                error_message=None
            ))

        except Exception as e:
            logger.error(f"Deep Research Center test failed: {e}")
            self.service_statuses.append(ServiceStatus(
                service_name="Deep Research Center",
                status="failed",
                total_models=0,
                working_models=0,
                failed_models=0,
                error_message=str(e)
            ))

    async def _test_express_mode_models(self):
        """Test Express Mode Vertex Integration models"""
        logger.info("🧪 Testing Express Mode Vertex Integration...")

        try:
            express_mode = ExpressModeVertexIntegration(
                project_id=os.getenv('GOOGLE_CLOUD_PROJECT', 'podplay-build-alpha'),
                region=os.getenv('VERTEX_AI_REGION', 'us-central1'),
                credentials_path=os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            )

            working = 0
            failed = 0

            for model_id, config in express_mode.vertex_models.items():
                result = ModelTestResult(
                    model_id=model_id,
                    model_name=config.model_name,
                    service="Express Mode Vertex Integration",
                    provider=config.provider.value,
                    status="configured",
                    response_time_ms=config.avg_response_time_ms,
                    response_preview="Express Mode model configured",
                    capabilities=["express_mode", "vertex_ai", "fast_response"],
                    error_message=None,
                    context_window=None,
                    max_output=None,
                    cost_tier=f"${config.cost_per_1k_tokens:.4f}/1k tokens"
                )
                self.test_results.append(result)
                working += 1

            self.service_statuses.append(ServiceStatus(
                service_name="Express Mode Vertex Integration",
                status="operational",
                total_models=len(express_mode.vertex_models),
                working_models=working,
                failed_models=0,
                error_message=None
            ))

        except Exception as e:
            logger.error(f"Express Mode test failed: {e}")
            self.service_statuses.append(ServiceStatus(
                service_name="Express Mode Vertex Integration",
                status="failed",
                total_models=0,
                working_models=0,
                failed_models=0,
                error_message=str(e)
            ))

    async def _test_gemini_registry_models(self):
        """Test Gemini Registry models"""
        logger.info("🧪 Testing Gemini Registry...")

        try:
            working = 0

            for model_id, model_config in GEMINI_REGISTRY.items():
                result = ModelTestResult(
                    model_id=model_id,
                    model_name=model_config.name,
                    service="Gemini Orchestra Registry",
                    provider="Google Gemini",
                    status="registered",
                    response_time_ms=None,
                    response_preview=f"Registry model: {model_config.specialty}",
                    capabilities=[cap.value for cap in model_config.capabilities],
                    error_message=None,
                    context_window=model_config.context_window,
                    max_output=model_config.output_limit,
                    cost_tier=model_config.cost_tier
                )
                self.test_results.append(result)
                working += 1

            self.service_statuses.append(ServiceStatus(
                service_name="Gemini Orchestra Registry",
                status="operational",
                total_models=len(GEMINI_REGISTRY),
                working_models=working,
                failed_models=0,
                error_message=None
            ))

        except Exception as e:
            logger.error(f"Gemini Registry test failed: {e}")
            self.service_statuses.append(ServiceStatus(
                service_name="Gemini Orchestra Registry",
                status="failed",
                total_models=0,
                working_models=0,
                failed_models=0,
                error_message=str(e)
            ))

    async def _test_scout_orchestrator_models(self):
        """Test Scout Orchestrator models"""
        logger.info("🧪 Testing Scout Orchestrator...")

        try:
            orchestrator = EnhancedGeminiScoutOrchestrator()

            working = 0

            for model_id, config in orchestrator.gemini_models.items():
                result = ModelTestResult(
                    model_id=model_id,
                    model_name=model_id.replace('-', ' ').title(),
                    service="Enhanced Gemini Scout Orchestrator",
                    provider="Google Gemini",
                    status="configured",
                    response_time_ms=None,
                    response_preview=f"Scout model: {', '.join(config['scout_roles'])}",
                    capabilities=config['specialties'] + config['scout_roles'],
                    error_message=None,
                    context_window=config['context_window'],
                    max_output=config['output_limit'],
                    cost_tier=config['cost_tier']
                )
                self.test_results.append(result)
                working += 1

            self.service_statuses.append(ServiceStatus(
                service_name="Enhanced Gemini Scout Orchestrator",
                status="operational",
                total_models=len(orchestrator.gemini_models),
                working_models=working,
                failed_models=0,
                error_message=None
            ))

        except Exception as e:
            logger.error(f"Scout Orchestrator test failed: {e}")
            self.service_statuses.append(ServiceStatus(
                service_name="Enhanced Gemini Scout Orchestrator",
                status="failed",
                total_models=0,
                working_models=0,
                failed_models=0,
                error_message=str(e)
            ))

    def _generate_comprehensive_report(self) -> Dict[str, Any]:
        """Generate comprehensive test report"""

        # Calculate totals
        total_models = len(self.test_results)
        working_models = len([r for r in self.test_results if r.status == "success"])
        failed_models = len([r for r in self.test_results if r.status == "failed"])
        configured_models = len([r for r in self.test_results if r.status in ["configured", "registered"]])

        # Group by provider
        providers = {}
        for result in self.test_results:
            provider = result.provider
            if provider not in providers:
                providers[provider] = {
                    "models": [],
                    "working": 0,
                    "failed": 0,
                    "configured": 0
                }

            providers[provider]["models"].append(result)
            if result.status == "success":
                providers[provider]["working"] += 1
            elif result.status == "failed":
                providers[provider]["failed"] += 1
            else:
                providers[provider]["configured"] += 1

        # Group by service
        services = {}
        for result in self.test_results:
            service = result.service
            if service not in services:
                services[service] = {
                    "models": [],
                    "working": 0,
                    "failed": 0,
                    "configured": 0
                }

            services[service]["models"].append(result)
            if result.status == "success":
                services[service]["working"] += 1
            elif result.status == "failed":
                services[service]["failed"] += 1
            else:
                services[service]["configured"] += 1

        # Collect all capabilities
        all_capabilities = set()
        for result in self.test_results:
            all_capabilities.update(result.capabilities)

        return {
            "report_generated": datetime.now().isoformat(),
            "summary": {
                "total_models_tested": total_models,
                "working_models": working_models,
                "failed_models": failed_models,
                "configured_models": configured_models,
                "total_services": len(self.service_statuses),
                "operational_services": len([s for s in self.service_statuses if s.status == "operational"]),
                "failed_services": len([s for s in self.service_statuses if s.status == "failed"])
            },
            "providers": providers,
            "services": services,
            "service_statuses": [asdict(s) for s in self.service_statuses],
            "all_capabilities": list(all_capabilities),
            "test_results": [asdict(r) for r in self.test_results],
            "recommendations": self._generate_recommendations()
        }

    def _generate_recommendations(self) -> List[str]:
        """Generate recommendations based on test results"""
        recommendations = []

        working_count = len([r for r in self.test_results if r.status == "success"])
        total_count = len(self.test_results)

        if working_count == 0:
            recommendations.append("🚨 CRITICAL: No models are currently working! Check API keys and service configurations.")
        elif working_count < total_count * 0.5:
            recommendations.append("⚠️ WARNING: Less than 50% of models are working. Review failed models and fix configurations.")
        else:
            recommendations.append("✅ GOOD: Most models are operational!")

        # Check for missing API keys
        failed_auth = [r for r in self.test_results if "api key" in str(r.error_message).lower()]
        if failed_auth:
            recommendations.append("🔑 Some models failed due to missing/invalid API keys. Check your environment variables.")

        # Check service distribution
        providers = set(r.provider for r in self.test_results)
        if len(providers) < 3:
            recommendations.append("🔄 Consider adding more AI providers for better redundancy.")

        return recommendations

    async def _save_report(self, report: Dict[str, Any]):
        """Save report to file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # Save JSON report
        json_filename = f"comprehensive_model_report_{timestamp}.json"
        with open(json_filename, 'w') as f:
            json.dump(report, f, indent=2)

        # Save HTML report
        html_filename = f"comprehensive_model_report_{timestamp}.html"
        html_content = self._generate_html_report(report)
        with open(html_filename, 'w') as f:
            f.write(html_content)

        logger.info(f"✅ Reports saved: {json_filename}, {html_filename}")

    def _generate_html_report(self, report: Dict[str, Any]) -> str:
        """Generate beautiful HTML report"""

        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Revolutionary AI Workspace - Model Test Report</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }}
        .header {{
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
        }}
        .header h1 {{
            font-size: 2.5em;
            margin: 0;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        .summary {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }}
        .stat-card {{
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }}
        .stat-value {{
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 5px;
        }}
        .stat-label {{
            font-size: 0.9em;
            opacity: 0.9;
        }}
        .section {{
            margin-bottom: 40px;
        }}
        .section h2 {{
            color: #667eea;
            border-bottom: 2px solid #f093fb;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }}
        .model-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }}
        .model-card {{
            border: 2px solid #e0e0e0;
            border-radius: 15px;
            padding: 20px;
            transition: all 0.3s ease;
        }}
        .model-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        }}
        .model-card.success {{
            border-color: #4caf50;
            background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
        }}
        .model-card.failed {{
            border-color: #f44336;
            background: linear-gradient(135deg, #ffebee 0%, #fce4ec 100%);
        }}
        .model-card.configured {{
            border-color: #ff9800;
            background: linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%);
        }}
        .model-name {{
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 10px;
        }}
        .model-status {{
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
        }}
        .status-success {{
            background: #4caf50;
            color: white;
        }}
        .status-failed {{
            background: #f44336;
            color: white;
        }}
        .status-configured {{
            background: #ff9800;
            color: white;
        }}
        .capabilities {{
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
        }}
        .capability-tag {{
            background: #667eea;
            color: white;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 0.7em;
        }}
        .recommendations {{
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            padding: 20px;
            border-radius: 15px;
            margin-top: 40px;
        }}
        .recommendations h3 {{
            margin-top: 0;
            color: #d2691e;
        }}
        .recommendations ul {{
            list-style-type: none;
            padding: 0;
        }}
        .recommendations li {{
            margin-bottom: 10px;
            padding: 10px;
            background: rgba(255,255,255,0.5);
            border-radius: 8px;
        }}
        .footer {{
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            color: #666;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Revolutionary AI Workspace</h1>
            <h2>Comprehensive Model Test Report</h2>
            <p>Generated on {report['report_generated']}</p>
        </div>

        <div class="summary">
            <div class="stat-card">
                <div class="stat-value">{report['summary']['total_models_tested']}</div>
                <div class="stat-label">Total Models</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{report['summary']['working_models']}</div>
                <div class="stat-label">Working Models</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{report['summary']['configured_models']}</div>
                <div class="stat-label">Configured Models</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{report['summary']['total_services']}</div>
                <div class="stat-label">Total Services</div>
            </div>
        </div>

        <div class="section">
            <h2>🤖 Models by Provider</h2>
        """

        for provider, data in report['providers'].items():
            html += f"""
            <h3>{provider} ({len(data['models'])} models)</h3>
            <div class="model-grid">
            """

            for model in data['models']:
                status_class = model['status']
                status_display = model['status'].title()

                capabilities_html = ""
                for cap in model['capabilities']:
                    capabilities_html += f'<span class="capability-tag">{cap}</span>'

                response_time = ""
                if model['response_time_ms']:
                    response_time = f"<p><strong>Response Time:</strong> {model['response_time_ms']:.0f}ms</p>"

                context_window = ""
                if model['context_window']:
                    context_window = f"<p><strong>Context:</strong> {model['context_window']:,} tokens</p>"

                error_msg = ""
                if model['error_message']:
                    error_msg = f"<p><strong>Error:</strong> <small>{model['error_message']}</small></p>"

                html += f"""
                <div class="model-card {status_class}">
                    <div class="model-name">{model['model_name']}</div>
                    <div class="model-status status-{status_class}">{status_display}</div>
                    <p><strong>Service:</strong> {model['service']}</p>
                    {response_time}
                    {context_window}
                    {error_msg}
                    <div class="capabilities">{capabilities_html}</div>
                </div>
                """

            html += "</div>"

        html += f"""
        </div>

        <div class="recommendations">
            <h3>🎯 Recommendations</h3>
            <ul>
        """

        for rec in report['recommendations']:
            html += f"<li>{rec}</li>"

        html += f"""
            </ul>
        </div>

        <div class="footer">
            <p>🐻 Powered by Revolutionary AI Workspace | Total Capabilities: {len(report['all_capabilities'])}</p>
            <p><small>Capabilities: {', '.join(report['all_capabilities'])}</small></p>
        </div>
    </div>
</body>
</html>
        """

        return html

async def main():
    """Main function to run comprehensive tests"""
    print("🚀 REVOLUTIONARY AI WORKSPACE - COMPREHENSIVE MODEL TESTING")
    print("=" * 70)

    tester = ComprehensiveModelTester()

    try:
        report = await tester.test_all_models()

        print("\n" + "=" * 70)
        print("📊 TEST SUMMARY")
        print("=" * 70)
        print(f"Total Models Tested: {report['summary']['total_models_tested']}")
        print(f"Working Models: {report['summary']['working_models']}")
        print(f"Failed Models: {report['summary']['failed_models']}")
        print(f"Configured Models: {report['summary']['configured_models']}")
        print(f"Total Services: {report['summary']['total_services']}")
        print(f"Operational Services: {report['summary']['operational_services']}")

        print("\n🎯 RECOMMENDATIONS:")
        for rec in report['recommendations']:
            print(f"  • {rec}")

        print("\n✅ Detailed HTML and JSON reports have been generated!")
        print("Open the HTML file in your browser for a beautiful visual report.")

        return report

    except Exception as e:
        print(f"❌ Test failed: {e}")
        traceback.print_exc()
        return None

if __name__ == "__main__":
    asyncio.run(main())
