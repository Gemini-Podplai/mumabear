#!/usr/bin/env python3
"""
🚀 QUICK MODEL CAPABILITY REPORT
Generates a comprehensive list of all available models and their capabilities
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Any

# Set up environment
from dotenv import load_dotenv
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.WARNING)  # Reduce noise

def get_model_capabilities_report() -> Dict[str, Any]:
    """Generate comprehensive model capabilities report"""

    report = {
        "report_generated": datetime.now().isoformat(),
        "revolutionary_ai_workspace": "Model Capabilities Report",
        "total_models": 0,
        "model_categories": {}
    }

    # 1. OpenAI Vertex Service Models
    openai_models = {
        "gpt-4o": {
            "name": "GPT-4o",
            "provider": "OpenAI via Vertex AI",
            "capabilities": ["chat", "completion", "reasoning", "code", "multimodal"],
            "context_window": 128000,
            "max_output": 4096,
            "proxy_model": "gemini-1.5-pro",
            "cost_tier": "premium",
            "status": "configured"
        },
        "gpt-4o-mini": {
            "name": "GPT-4o Mini",
            "provider": "OpenAI via Vertex AI",
            "capabilities": ["chat", "completion", "fast", "code"],
            "context_window": 128000,
            "max_output": 4096,
            "proxy_model": "gemini-1.5-flash",
            "cost_tier": "medium",
            "status": "configured"
        },
        "gpt-4": {
            "name": "GPT-4",
            "provider": "OpenAI via Vertex AI",
            "capabilities": ["chat", "completion", "reasoning", "analysis"],
            "context_window": 8192,
            "max_output": 4096,
            "proxy_model": "gemini-1.5-pro",
            "cost_tier": "premium",
            "status": "configured"
        },
        "gpt-4-turbo": {
            "name": "GPT-4 Turbo",
            "provider": "OpenAI via Vertex AI",
            "capabilities": ["chat", "completion", "reasoning", "code", "multimodal"],
            "context_window": 128000,
            "max_output": 4096,
            "proxy_model": "gemini-1.5-pro",
            "cost_tier": "premium",
            "status": "configured"
        },
        "gpt-3.5-turbo": {
            "name": "GPT-3.5 Turbo",
            "provider": "OpenAI via Vertex AI",
            "capabilities": ["chat", "completion", "fast"],
            "context_window": 16385,
            "max_output": 4096,
            "proxy_model": "gemini-1.5-flash",
            "cost_tier": "low",
            "status": "configured"
        }
    }

    # 2. Claude Models (Direct Anthropic + Vertex AI)
    claude_models = {
        "claude-3-5-sonnet": {
            "name": "Claude 3.5 Sonnet",
            "provider": "Anthropic",
            "capabilities": ["chat", "reasoning", "code", "analysis", "computer_use", "function_calling"],
            "context_window": 200000,
            "max_output": 8192,
            "cost_tier": "premium",
            "status": "available"
        },
        "claude-3-opus": {
            "name": "Claude 3 Opus",
            "provider": "Anthropic",
            "capabilities": ["chat", "reasoning", "analysis", "creative_writing", "research"],
            "context_window": 200000,
            "max_output": 4096,
            "cost_tier": "enterprise",
            "status": "available"
        },
        "claude-3-haiku": {
            "name": "Claude 3 Haiku",
            "provider": "Anthropic",
            "capabilities": ["chat", "fast", "lightweight"],
            "context_window": 200000,
            "max_output": 4096,
            "cost_tier": "low",
            "status": "available"
        },
        "claude-4-opus": {
            "name": "Claude 4 Opus (Vertex AI)",
            "provider": "Anthropic via Vertex AI",
            "capabilities": ["advanced_coding", "long_horizon_tasks", "ai_agents", "agentic_search"],
            "context_window": 200000,
            "max_output": 8192,
            "cost_tier": "enterprise",
            "status": "vertex_ai"
        },
        "claude-4-sonnet": {
            "name": "Claude 4 Sonnet (Vertex AI)",
            "provider": "Anthropic via Vertex AI",
            "capabilities": ["everyday_development", "code_reviews", "api_integrations"],
            "context_window": 200000,
            "max_output": 8192,
            "cost_tier": "premium",
            "status": "vertex_ai"
        },
        "claude-3.5-sonnet-v2": {
            "name": "Claude 3.5 Sonnet v2 (Vertex AI)",
            "provider": "Anthropic via Vertex AI",
            "capabilities": ["tool_use", "agentic_workflows", "advanced_reasoning"],
            "context_window": 200000,
            "max_output": 8192,
            "cost_tier": "premium",
            "status": "vertex_ai"
        },
        "claude-3.5-haiku": {
            "name": "Claude 3.5 Haiku (Vertex AI)",
            "provider": "Anthropic via Vertex AI",
            "capabilities": ["speed", "cost_effectiveness", "real_time_responses"],
            "context_window": 200000,
            "max_output": 8192,
            "cost_tier": "low",
            "status": "vertex_ai"
        }
    }

    # 3. Gemini Models (Direct API + Vertex AI)
    gemini_models = {
        # Gemini 2.5 Pro Models
        "gemini-2.5-pro": {
            "name": "Gemini 2.5 Pro",
            "provider": "Google Gemini",
            "capabilities": ["advanced_reasoning", "complex_analysis", "coding", "multimodal"],
            "context_window": 2000000,
            "max_output": 8192,
            "cost_tier": "premium",
            "status": "available"
        },
        "gemini-2.5-pro-thinking": {
            "name": "Gemini 2.5 Pro Thinking",
            "provider": "Google Gemini",
            "capabilities": ["thinking", "reasoning", "long_output", "complex_debugging"],
            "context_window": 1048576,
            "max_output": 65536,
            "cost_tier": "premium",
            "status": "available"
        },

        # Gemini 2.5 Flash Models
        "gemini-2.5-flash": {
            "name": "Gemini 2.5 Flash",
            "provider": "Google Gemini",
            "capabilities": ["fast", "reasoning", "coding", "batch_processing"],
            "context_window": 1000000,
            "max_output": 8192,
            "cost_tier": "medium",
            "status": "available"
        },
        "gemini-2.5-flash-thinking": {
            "name": "Gemini 2.5 Flash Thinking",
            "provider": "Google Gemini",
            "capabilities": ["thinking", "reasoning", "complex_reasoning_backup"],
            "context_window": 1048576,
            "max_output": 65536,
            "cost_tier": "medium",
            "status": "available"
        },

        # Gemini 2.0 Models
        "gemini-2.0-flash": {
            "name": "Gemini 2.0 Flash",
            "provider": "Google Gemini",
            "capabilities": ["ultra_fast", "real_time", "live_collaboration"],
            "context_window": 1048576,
            "max_output": 8192,
            "cost_tier": "low",
            "status": "available"
        },
        "gemini-2.0-flash-lite": {
            "name": "Gemini 2.0 Flash Lite",
            "provider": "Google Gemini",
            "capabilities": ["speed", "instant_responses", "ui_interactions"],
            "context_window": 1048576,
            "max_output": 8192,
            "cost_tier": "free",
            "status": "available"
        },
        "gemini-2.0-flash-thinking": {
            "name": "Gemini 2.0 Flash Thinking",
            "provider": "Google Gemini",
            "capabilities": ["thinking", "architecture_decisions", "complex_debugging"],
            "context_window": 1048576,
            "max_output": 65536,
            "cost_tier": "medium",
            "status": "available"
        },

        # Gemini 1.5 Models
        "gemini-1.5-pro": {
            "name": "Gemini 1.5 Pro",
            "provider": "Google Gemini",
            "capabilities": ["reasoning", "analysis", "large_context", "multimodal"],
            "context_window": 2000000,
            "max_output": 8192,
            "cost_tier": "premium",
            "status": "available"
        },
        "gemini-1.5-flash": {
            "name": "Gemini 1.5 Flash",
            "provider": "Google Gemini",
            "capabilities": ["speed", "efficiency", "general_purpose"],
            "context_window": 1000000,
            "max_output": 8192,
            "cost_tier": "medium",
            "status": "available"
        },
        "gemini-1.5-flash-8b": {
            "name": "Gemini 1.5 Flash 8B",
            "provider": "Google Gemini",
            "capabilities": ["ultra_fast", "high_volume", "cost_effective"],
            "context_window": 1000000,
            "max_output": 8192,
            "cost_tier": "free",
            "status": "available"
        },

        # Specialized Gemini Models
        "gemini-pro-vision": {
            "name": "Gemini Pro Vision",
            "provider": "Google Gemini",
            "capabilities": ["vision", "multimodal", "image_analysis"],
            "context_window": 12288,
            "max_output": 4096,
            "cost_tier": "premium",
            "status": "available"
        },
        "gemini-embedding": {
            "name": "Gemini Embedding",
            "provider": "Google Gemini",
            "capabilities": ["embedding", "vector_search", "semantic_analysis"],
            "context_window": 8192,
            "max_output": 1,
            "cost_tier": "low",
            "status": "available"
        }
    }

    # 4. Vertex AI Express Mode Models
    vertex_express_models = {
        "gemini-2.5-pro-vertex": {
            "name": "Gemini 2.5 Pro (Vertex AI)",
            "provider": "Google Vertex AI",
            "capabilities": ["express_mode", "large_context", "multimodal"],
            "context_window": 2000000,
            "max_output": 8192,
            "avg_response_time_ms": 400,
            "cost_tier": "premium",
            "status": "vertex_ai"
        },
        "gemini-2.5-flash-vertex": {
            "name": "Gemini 2.5 Flash (Vertex AI)",
            "provider": "Google Vertex AI",
            "capabilities": ["fastest_responses", "cost_effective", "high_throughput"],
            "context_window": 1000000,
            "max_output": 8192,
            "avg_response_time_ms": 200,
            "cost_tier": "medium",
            "status": "vertex_ai"
        }
    }

    # 5. Revolutionary AI Orchestra Models (Specialized Variants)
    orchestra_models = {
        "conductor": {
            "name": "Conductor (Gemini 2.5 Pro)",
            "provider": "Revolutionary AI Orchestra",
            "capabilities": ["task_routing", "orchestration", "master_conductor"],
            "context_window": 1048576,
            "max_output": 65536,
            "specialty": "ultimate_task_router",
            "status": "orchestrated"
        },
        "deep_thinker_primary": {
            "name": "Deep Thinker (Gemini 2.0 Flash Thinking)",
            "provider": "Revolutionary AI Orchestra",
            "capabilities": ["thinking", "reasoning", "architecture_decisions"],
            "context_window": 1048576,
            "max_output": 65536,
            "specialty": "complex_analysis",
            "status": "orchestrated"
        },
        "speed_demon_primary": {
            "name": "Speed Demon (Gemini 2.0 Flash Lite)",
            "provider": "Revolutionary AI Orchestra",
            "capabilities": ["speed", "instant_responses", "ui_interactions"],
            "context_window": 1048576,
            "max_output": 8192,
            "specialty": "instant_responses",
            "status": "orchestrated"
        },
        "context_master_primary": {
            "name": "Context Master (Gemini 1.5 Pro)",
            "provider": "Revolutionary AI Orchestra",
            "capabilities": ["massive_context", "document_analysis", "long_form"],
            "context_window": 2000000,
            "max_output": 8192,
            "specialty": "2m_context_window",
            "status": "orchestrated"
        },
        "creative_writer_primary": {
            "name": "Creative Writer (Gemini 2.5 Pro)",
            "provider": "Revolutionary AI Orchestra",
            "capabilities": ["creativity", "writing", "storytelling", "long_output"],
            "context_window": 1048576,
            "max_output": 65536,
            "specialty": "65k_output",
            "status": "orchestrated"
        },
        "code_specialist_primary": {
            "name": "Code Specialist (Gemini 2.5 Flash)",
            "provider": "Revolutionary AI Orchestra",
            "capabilities": ["coding", "development", "debugging", "optimization"],
            "context_window": 1000000,
            "max_output": 8192,
            "specialty": "code_generation",
            "status": "orchestrated"
        },
        "research_expert_primary": {
            "name": "Research Expert (Gemini 1.5 Pro)",
            "provider": "Revolutionary AI Orchestra",
            "capabilities": ["research", "analysis", "investigation", "deep_research"],
            "context_window": 2000000,
            "max_output": 8192,
            "specialty": "research_analysis",
            "status": "orchestrated"
        }
    }

    # 6. Specialized Service Models
    specialized_models = {
        "deep_research_claude_opus": {
            "name": "Deep Research Claude Opus",
            "provider": "Deep Research Center",
            "capabilities": ["exhaustive_research", "complex_analysis", "collaboration"],
            "context_window": 200000,
            "max_output": 4096,
            "specialty": "research_collaboration",
            "status": "research_service"
        },
        "deep_research_gemini_pro": {
            "name": "Deep Research Gemini Pro",
            "provider": "Deep Research Center",
            "capabilities": ["deep_research", "gemini_search", "collaborative_research"],
            "context_window": 2000000,
            "max_output": 8192,
            "specialty": "gemini_deep_research",
            "status": "research_service"
        },
        "mama_bear_v3_agentic": {
            "name": "Mama Bear V3 Agentic Superpowers",
            "provider": "Mama Bear Agentic Service",
            "capabilities": ["agentic_ai", "memory_operations", "mem0_integration", "superpowers"],
            "context_window": 2000000,
            "max_output": 8192,
            "specialty": "agentic_intelligence",
            "status": "agentic_service"
        },
        "scout_orchestrator": {
            "name": "Enhanced Gemini Scout Orchestrator",
            "provider": "Scout Workflow Service",
            "capabilities": ["workflow_orchestration", "scout_roles", "multi_stage_processing"],
            "context_window": 1000000,
            "max_output": 8192,
            "specialty": "workflow_automation",
            "status": "scout_service"
        }
    }

    # Compile the report
    report["model_categories"] = {
        "openai_vertex_models": {
            "description": "OpenAI models accessed via Vertex AI Model Garden",
            "total_models": len(openai_models),
            "models": openai_models
        },
        "claude_models": {
            "description": "Claude models (Direct Anthropic + Vertex AI access)",
            "total_models": len(claude_models),
            "models": claude_models
        },
        "gemini_models": {
            "description": "Google Gemini models (Direct API access)",
            "total_models": len(gemini_models),
            "models": gemini_models
        },
        "vertex_express_models": {
            "description": "Vertex AI Express Mode optimized models",
            "total_models": len(vertex_express_models),
            "models": vertex_express_models
        },
        "orchestra_models": {
            "description": "Revolutionary AI Orchestra specialized variants",
            "total_models": len(orchestra_models),
            "models": orchestra_models
        },
        "specialized_service_models": {
            "description": "Specialized service models for specific use cases",
            "total_models": len(specialized_models),
            "models": specialized_models
        }
    }

    # Calculate totals
    total_models = sum(cat["total_models"] for cat in report["model_categories"].values())
    report["total_models"] = total_models

    # Add capability summary
    all_capabilities = set()
    for category in report["model_categories"].values():
        for model in category["models"].values():
            all_capabilities.update(model["capabilities"])

    report["capability_summary"] = {
        "total_unique_capabilities": len(all_capabilities),
        "all_capabilities": sorted(list(all_capabilities))
    }

    # Add provider summary
    provider_counts = {}
    for category in report["model_categories"].values():
        for model in category["models"].values():
            provider = model["provider"]
            provider_counts[provider] = provider_counts.get(provider, 0) + 1

    report["provider_summary"] = provider_counts

    return report

def generate_beautiful_html_report(report: Dict[str, Any]) -> str:
    """Generate beautiful HTML report"""

    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Revolutionary AI Workspace - Model Capabilities Report</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
        }}
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }}
        .header {{
            text-align: center;
            margin-bottom: 50px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 30px;
        }}
        .header h1 {{
            font-size: 3em;
            margin: 0;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        .header .subtitle {{
            font-size: 1.2em;
            color: #666;
            margin-top: 10px;
        }}
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 50px;
        }}
        .stat-card {{
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transform: translateY(0);
            transition: all 0.3s ease;
        }}
        .stat-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }}
        .stat-value {{
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
        }}
        .stat-label {{
            font-size: 1em;
            opacity: 0.9;
        }}
        .category-section {{
            margin-bottom: 50px;
        }}
        .category-header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 15px 15px 0 0;
            margin-bottom: 0;
        }}
        .category-title {{
            font-size: 1.5em;
            font-weight: bold;
            margin: 0;
        }}
        .category-description {{
            margin: 5px 0 0 0;
            opacity: 0.9;
        }}
        .models-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 0 0 15px 15px;
        }}
        .model-card {{
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }}
        .model-card::before {{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
        }}
        .model-card:hover {{
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(0,0,0,0.1);
            border-color: #667eea;
        }}
        .model-name {{
            font-size: 1.1em;
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
        }}
        .model-provider {{
            color: #666;
            font-size: 0.9em;
            margin-bottom: 12px;
        }}
        .model-specs {{
            margin-bottom: 15px;
        }}
        .spec-item {{
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 0.85em;
        }}
        .spec-label {{
            color: #666;
        }}
        .spec-value {{
            font-weight: 500;
            color: #333;
        }}
        .capabilities {{
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 15px;
        }}
        .capability-tag {{
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 0.75em;
            font-weight: 500;
        }}
        .status-badge {{
            position: absolute;
            top: 15px;
            right: 15px;
            padding: 4px 8px;
            border-radius: 10px;
            font-size: 0.7em;
            font-weight: bold;
            text-transform: uppercase;
        }}
        .status-available {{
            background: #4caf50;
            color: white;
        }}
        .status-configured {{
            background: #ff9800;
            color: white;
        }}
        .status-vertex_ai {{
            background: #2196f3;
            color: white;
        }}
        .status-orchestrated {{
            background: #9c27b0;
            color: white;
        }}
        .status-research_service {{
            background: #607d8b;
            color: white;
        }}
        .status-agentic_service {{
            background: #e91e63;
            color: white;
        }}
        .status-scout_service {{
            background: #795548;
            color: white;
        }}
        .summary-section {{
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            padding: 30px;
            border-radius: 15px;
            margin-top: 50px;
        }}
        .summary-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }}
        .summary-item h3 {{
            color: #d2691e;
            margin-top: 0;
            margin-bottom: 15px;
        }}
        .provider-list {{
            list-style: none;
            padding: 0;
        }}
        .provider-item {{
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 8px;
            background: rgba(255,255,255,0.5);
            border-radius: 6px;
        }}
        .capability-grid {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }}
        .capability-item {{
            background: rgba(255,255,255,0.7);
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.85em;
        }}
        .footer {{
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e0e0e0;
            color: #666;
        }}
        .footer p {{
            margin: 5px 0;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Revolutionary AI Workspace</h1>
            <div class="subtitle">Comprehensive Model Capabilities Report</div>
            <p>Generated on {report['report_generated']}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">{report['total_models']}</div>
                <div class="stat-label">Total Models</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{len(report['model_categories'])}</div>
                <div class="stat-label">Model Categories</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{len(report['provider_summary'])}</div>
                <div class="stat-label">AI Providers</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{report['capability_summary']['total_unique_capabilities']}</div>
                <div class="stat-label">Unique Capabilities</div>
            </div>
        </div>
    """

    # Add model categories
    for category_key, category_data in report["model_categories"].items():
        html += f"""
        <div class="category-section">
            <div class="category-header">
                <div class="category-title">{category_data['description']}</div>
                <div class="category-description">{category_data['total_models']} models available</div>
            </div>
            <div class="models-grid">
        """

        for model_id, model_data in category_data["models"].items():
            capabilities_html = ""
            for cap in model_data["capabilities"]:
                capabilities_html += f'<span class="capability-tag">{cap.replace("_", " ").title()}</span>'

            context_window = "N/A"
            if model_data.get("context_window"):
                context_window = f"{model_data['context_window']:,}"

            max_output = "N/A"
            if model_data.get("max_output"):
                max_output = f"{model_data['max_output']:,}"

            response_time = ""
            if model_data.get("avg_response_time_ms"):
                response_time = f"""
                <div class="spec-item">
                    <span class="spec-label">Avg Response:</span>
                    <span class="spec-value">{model_data['avg_response_time_ms']}ms</span>
                </div>
                """

            specialty = ""
            if model_data.get("specialty"):
                specialty = f"""
                <div class="spec-item">
                    <span class="spec-label">Specialty:</span>
                    <span class="spec-value">{model_data['specialty'].replace('_', ' ').title()}</span>
                </div>
                """

            html += f"""
            <div class="model-card">
                <div class="status-badge status-{model_data['status']}">{model_data['status'].replace('_', ' ').title()}</div>
                <div class="model-name">{model_data['name']}</div>
                <div class="model-provider">{model_data['provider']}</div>
                <div class="model-specs">
                    <div class="spec-item">
                        <span class="spec-label">Context Window:</span>
                        <span class="spec-value">{context_window} tokens</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Max Output:</span>
                        <span class="spec-value">{max_output} tokens</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Cost Tier:</span>
                        <span class="spec-value">{model_data.get('cost_tier', 'Unknown').title()}</span>
                    </div>
                    {response_time}
                    {specialty}
                </div>
                <div class="capabilities">{capabilities_html}</div>
            </div>
            """

        html += "</div></div>"

    # Add summary section
    provider_list_html = ""
    for provider, count in report["provider_summary"].items():
        provider_list_html += f"""
        <div class="provider-item">
            <span>{provider}</span>
            <strong>{count} models</strong>
        </div>
        """

    capability_grid_html = ""
    for capability in sorted(report["capability_summary"]["all_capabilities"]):
        capability_grid_html += f'<span class="capability-item">{capability.replace("_", " ").title()}</span>'

    html += f"""
        <div class="summary-section">
            <div class="summary-grid">
                <div class="summary-item">
                    <h3>🤖 Providers</h3>
                    <div class="provider-list">
                        {provider_list_html}
                    </div>
                </div>
                <div class="summary-item">
                    <h3>🛠️ All Capabilities</h3>
                    <div class="capability-grid">
                        {capability_grid_html}
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p><strong>🐻 Powered by Revolutionary AI Workspace</strong></p>
            <p>The most comprehensive AI model ecosystem available</p>
            <p><small>Featuring OpenAI, Claude, Gemini, and Specialized Orchestra Models</small></p>
        </div>
    </div>
</body>
</html>
    """

    return html

def main():
    """Generate and save the comprehensive model report"""
    print("🚀 REVOLUTIONARY AI WORKSPACE - MODEL CAPABILITIES REPORT")
    print("=" * 70)

    # Generate report
    report = get_model_capabilities_report()

    # Print summary
    print(f"\n📊 COMPREHENSIVE MODEL INVENTORY")
    print("=" * 70)
    print(f"Total Models Available: {report['total_models']}")
    print(f"Model Categories: {len(report['model_categories'])}")
    print(f"AI Providers: {len(report['provider_summary'])}")
    print(f"Unique Capabilities: {report['capability_summary']['total_unique_capabilities']}")

    print(f"\n🤖 PROVIDER BREAKDOWN:")
    for provider, count in report['provider_summary'].items():
        print(f"  • {provider}: {count} models")

    print(f"\n📋 CATEGORY BREAKDOWN:")
    for category, data in report['model_categories'].items():
        print(f"  • {data['description']}: {data['total_models']} models")

    # Save reports
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Save JSON report
    json_filename = f"model_capabilities_report_{timestamp}.json"
    with open(json_filename, 'w') as f:
        json.dump(report, f, indent=2)

    # Save HTML report
    html_filename = f"model_capabilities_report_{timestamp}.html"
    html_content = generate_beautiful_html_report(report)
    with open(html_filename, 'w') as f:
        f.write(html_content)

    print(f"\n✅ REPORTS GENERATED:")
    print(f"  • JSON Report: {json_filename}")
    print(f"  • HTML Report: {html_filename}")
    print(f"\n🌐 Open the HTML file in your browser for a beautiful visual report!")

    return report

if __name__ == "__main__":
    main()
