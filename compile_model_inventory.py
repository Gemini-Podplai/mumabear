#!/usr/bin/env python3
"""
🏗️ Model Inventory Compiler - Podplay Sanctuary
Comprehensive documentation of ALL available models across ALL services
WITHOUT testing them - just documenting what's available
"""

import json
import requests
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
import os
import sys

# Add backend to path
sys.path.append('/home/woody/CascadeProjects/podplay-scout-alpha/backend')

class ModelInventoryCompiler:
    def __init__(self):
        self.base_url = "http://127.0.0.1:5001"
        self.inventory = {
            'compilation_date': datetime.now().isoformat(),
            'compiler_version': '1.0.0',
            'total_services_analyzed': 0,
            'total_models_discovered': 0,
            'total_api_keys_required': 0,
            'services': {},
            'api_keys_inventory': {},
            'model_summary': {
                'by_provider': {},
                'by_capability': {},
                'by_service': {}
            }
        }

    def get_endpoint_info(self, endpoint: str, timeout: int = 10) -> Dict[str, Any]:
        """Safely get information from an endpoint without testing models"""
        try:
            response = requests.get(f"{self.base_url}{endpoint}", timeout=timeout)
            if response.status_code == 200:
                return {'success': True, 'data': response.json()}
            else:
                return {'success': False, 'error': f"HTTP {response.status_code}", 'data': response.text}
        except Exception as e:
            return {'success': False, 'error': str(e), 'data': None}

    def post_endpoint_info(self, endpoint: str, payload: Dict[str, Any], timeout: int = 10) -> Dict[str, Any]:
        """Safely post to an endpoint for information gathering"""
        try:
            response = requests.post(f"{self.base_url}{endpoint}", json=payload, timeout=timeout)
            if response.status_code == 200:
                return {'success': True, 'data': response.json()}
            else:
                return {'success': False, 'error': f"HTTP {response.status_code}", 'data': response.text}
        except Exception as e:
            return {'success': False, 'error': str(e), 'data': None}

    def compile_express_mode_models(self):
        """Compile models from Express Mode services"""
        print("🚀 Compiling Express Mode models...")

        service_name = "Mama Bear Express Mode V2.0"
        self.inventory['services'][service_name] = {
            'description': 'Express Mode with autonomous routing and 6x faster responses',
            'endpoints': {},
            'models': {},
            'api_keys_required': ['GOOGLE_CLOUD_PROJECT', 'VERTEX_AI_LOCATION'],
            'status': 'checking...'
        }

        # Get Express Mode status
        status_info = self.get_endpoint_info('/api/mama-bear-v2/status')
        if status_info['success']:
            self.inventory['services'][service_name]['status'] = 'active'
            self.inventory['services'][service_name]['endpoints']['status'] = status_info['data']

        # Get available models
        models_info = self.get_endpoint_info('/api/mama-bear-v2/models')
        if models_info['success']:
            models_data = models_info['data']

            # Process vertex_ai_models
            if 'vertex_ai_models' in models_data:
                for category, models in models_data['vertex_ai_models'].items():
                    if isinstance(models, list):
                        for model in models:
                            model_id = model.get('model_id', 'unknown')
                            self.inventory['services'][service_name]['models'][model_id] = {
                                'name': model.get('name', model_id),
                                'provider': 'vertex_ai',
                                'category': category,
                                'capabilities': model.get('capabilities', []),
                                'use_cases': model.get('use_cases', []),
                                'response_time_ms': model.get('avg_response_time_ms', 'unknown'),
                                'cost_tier': model.get('cost_tier', 'unknown')
                            }

            # Process other model categories
            for category in ['gemini_api_models', 'fallback_models']:
                if category in models_data and 'models' in models_data[category]:
                    for model in models_data[category]['models']:
                        model_id = model.get('model_id', 'unknown')
                        self.inventory['services'][service_name]['models'][model_id] = {
                            'name': model.get('name', model_id),
                            'provider': models_data[category].get('provider', 'unknown'),
                            'category': category,
                            'capabilities': model.get('capabilities', []),
                            'use_cases': model.get('use_cases', []),
                            'response_time_ms': model.get('avg_response_time_ms', 'unknown'),
                            'cost_tier': model.get('cost_tier', 'unknown')
                        }

        self.inventory['total_services_analyzed'] += 1

    def compile_multimodal_chat_models(self):
        """Compile models from Multimodal Chat API"""
        print("🎨 Compiling Multimodal Chat models...")

        service_name = "Universal Multimodal Chat API"
        self.inventory['services'][service_name] = {
            'description': 'Universal model access with multimodal capabilities',
            'endpoints': {},
            'models': {},
            'api_keys_required': ['GOOGLE_CLOUD_PROJECT', 'VERTEX_AI_LOCATION'],
            'status': 'checking...'
        }

        # Get available models
        models_info = self.get_endpoint_info('/api/multimodal-chat/models')
        if models_info['success']:
            self.inventory['services'][service_name]['status'] = 'active'
            models_data = models_info['data']

            if 'models' in models_data:
                # Process categorized models
                for category, subcategories in models_data['models'].items():
                    if isinstance(subcategories, dict):
                        for subcategory, models in subcategories.items():
                            if isinstance(models, list):
                                for model in models:
                                    model_id = model.get('id', 'unknown')
                                    self.inventory['services'][service_name]['models'][model_id] = {
                                        'name': model.get('name', model_id),
                                        'provider': model.get('provider', 'unknown'),
                                        'category': f"{category}_{subcategory}",
                                        'capabilities': model.get('capabilities', []),
                                        'response_time_ms': model.get('response_time_target', 'unknown'),
                                        'cost_per_1k_tokens': model.get('cost_per_1k_tokens', 'unknown'),
                                        'express_mode': model.get('express_mode', False),
                                        'multimodal': model.get('multimodal', False)
                                    }
                    elif isinstance(subcategories, list):
                        # Direct list of models
                        for model in subcategories:
                            model_id = model.get('id', 'unknown')
                            self.inventory['services'][service_name]['models'][model_id] = {
                                'name': model.get('name', model_id),
                                'provider': model.get('provider', 'unknown'),
                                'category': category,
                                'capabilities': model.get('capabilities', []),
                                'response_time_ms': model.get('response_time_target', 'unknown'),
                                'cost_per_1k_tokens': model.get('cost_per_1k_tokens', 'unknown'),
                                'express_mode': model.get('express_mode', False),
                                'multimodal': model.get('multimodal', False)
                            }

        self.inventory['total_services_analyzed'] += 1

    def compile_chat_routes_models(self):
        """Compile models from Chat Routes"""
        print("💬 Compiling Chat Routes models...")

        service_name = "Chat Routes with Mama Bear Integration"
        self.inventory['services'][service_name] = {
            'description': 'Multi-model chat routing with Mama Bear personalities',
            'endpoints': {},
            'models': {},
            'api_keys_required': ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GOOGLE_AI_API_KEY'],
            'status': 'checking...'
        }

        # Get available models
        models_info = self.get_endpoint_info('/api/chat/models')
        if models_info['success']:
            self.inventory['services'][service_name]['status'] = 'active'
            models_data = models_info['data']

            if 'models' in models_data:
                for model_id, model_config in models_data['models'].items():
                    self.inventory['services'][service_name]['models'][model_id] = {
                        'name': model_config.get('name', model_id),
                        'provider': model_config.get('provider', 'unknown'),
                        'category': 'chat_routing',
                        'capabilities': model_config.get('capabilities', []),
                        'max_tokens': model_config.get('max_tokens', 'unknown'),
                        'supports_streaming': model_config.get('supports_streaming', False),
                        'supports_live_api': model_config.get('supports_live_api', False),
                        'mama_bear_variant': model_config.get('mama_bear_variant', 'unknown'),
                        'orchestration_priority': model_config.get('orchestration_priority', 'unknown')
                    }

        self.inventory['total_services_analyzed'] += 1

    def compile_multi_model_api(self):
        """Compile models from Multi-Model API"""
        print("🌐 Compiling Multi-Model API...")

        service_name = "Multi-Model Orchestrator API"
        self.inventory['services'][service_name] = {
            'description': 'Intelligent routing across multiple AI providers',
            'endpoints': {},
            'models': {},
            'api_keys_required': ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GOOGLE_AI_API_KEY'],
            'status': 'checking...'
        }

        # Get available models
        models_info = self.get_endpoint_info('/api/multi-model/models')
        if models_info['success']:
            self.inventory['services'][service_name]['status'] = 'active'
            self.inventory['services'][service_name]['endpoints']['models'] = models_info['data']

        # Get capabilities
        capabilities_info = self.get_endpoint_info('/api/multi-model/capabilities')
        if capabilities_info['success']:
            self.inventory['services'][service_name]['endpoints']['capabilities'] = capabilities_info['data']

        self.inventory['total_services_analyzed'] += 1

    def compile_openai_vertex_models(self):
        """Compile models from OpenAI Vertex API"""
        print("🤖 Compiling OpenAI Vertex models...")

        service_name = "OpenAI via Vertex AI Model Garden"
        self.inventory['services'][service_name] = {
            'description': 'OpenAI models via Google Cloud Vertex AI infrastructure',
            'endpoints': {},
            'models': {},
            'api_keys_required': ['GOOGLE_CLOUD_PROJECT', 'OPENAI_API_KEY'],
            'status': 'checking...'
        }

        # Get status
        status_info = self.get_endpoint_info('/api/openai-vertex/status')
        if status_info['success']:
            self.inventory['services'][service_name]['status'] = 'active'
            self.inventory['services'][service_name]['endpoints']['status'] = status_info['data']

        # Get available models
        models_info = self.get_endpoint_info('/api/openai-vertex/models')
        if models_info['success']:
            self.inventory['services'][service_name]['endpoints']['models'] = models_info['data']

            if 'data' in models_info['data']:
                for model in models_info['data']['data']:
                    model_id = model.get('id', 'unknown')
                    self.inventory['services'][service_name]['models'][model_id] = {
                        'name': model.get('name', model_id),
                        'provider': 'openai_vertex',
                        'category': 'openai_via_vertex',
                        'object': model.get('object', 'unknown'),
                        'capabilities': ['text', 'chat_completion'],
                        'vertex_enabled': True
                    }

        self.inventory['total_services_analyzed'] += 1

    def compile_pipedream_integration(self):
        """Compile Pipedream integration models and capabilities"""
        print("🔗 Compiling Pipedream integration...")

        service_name = "Pipedream Integration Service"
        self.inventory['services'][service_name] = {
            'description': 'Workflow automation and integration platform',
            'endpoints': {},
            'models': {},
            'api_keys_required': ['PIPEDREAM_API_KEY'],
            'status': 'checking...'
        }

        # Get health status
        health_info = self.get_endpoint_info('/api/pipedream/health')
        if health_info['success']:
            self.inventory['services'][service_name]['status'] = 'active'
            self.inventory['services'][service_name]['endpoints']['health'] = health_info['data']

        # Get workflows
        workflows_info = self.get_endpoint_info('/api/pipedream/workflows')
        if workflows_info['success']:
            self.inventory['services'][service_name]['endpoints']['workflows'] = workflows_info['data']

        self.inventory['total_services_analyzed'] += 1

    def compile_api_keys_inventory(self):
        """Compile comprehensive API keys inventory"""
        print("🔑 Compiling API keys inventory...")

        # Read environment file if it exists
        env_file_path = '/home/woody/CascadeProjects/podplay-scout-alpha/.env'
        env_keys = {}

        if os.path.exists(env_file_path):
            try:
                with open(env_file_path, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if '=' in line and not line.startswith('#'):
                            key, value = line.split('=', 1)
                            # Check if key has actual value (not placeholder)
                            if value and value != 'your_key_here' and not value.endswith('_here'):
                                env_keys[key] = 'configured'
                            else:
                                env_keys[key] = 'placeholder'
            except Exception as e:
                print(f"Warning: Could not read .env file: {e}")

        # Define expected API keys by category
        api_key_categories = {
            'AI_Models': [
                'OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GOOGLE_AI_API_KEY',
                'GEMINI_API_KEY_PRIMARY', 'GEMINI_API_KEY_SECONDARY'
            ],
            'Cloud_Infrastructure': [
                'GOOGLE_CLOUD_PROJECT', 'VERTEX_AI_LOCATION',
                'GOOGLE_APPLICATION_CREDENTIALS'
            ],
            'Memory_Storage': [
                'MEM0_API_KEY', 'MEM0_MEMORY_ENABLED'
            ],
            'Integration_Services': [
                'PIPEDREAM_API_KEY', 'SCRAPYBARA_API_KEY', 'E2B_API_KEY'
            ],
            'Development_Tools': [
                'GITHUB_TOKEN', 'NOTION_API_KEY'
            ]
        }

        for category, keys in api_key_categories.items():
            self.inventory['api_keys_inventory'][category] = {}
            for key in keys:
                status = env_keys.get(key, 'not_found')
                self.inventory['api_keys_inventory'][category][key] = {
                    'status': status,
                    'required_for': []
                }

        # Map keys to services
        for service_name, service_data in self.inventory['services'].items():
            for required_key in service_data.get('api_keys_required', []):
                # Find which category this key belongs to
                for category, keys in api_key_categories.items():
                    if required_key in keys:
                        if required_key in self.inventory['api_keys_inventory'][category]:
                            self.inventory['api_keys_inventory'][category][required_key]['required_for'].append(service_name)

        # Count configured keys
        configured_count = 0
        total_count = 0
        for category in self.inventory['api_keys_inventory'].values():
            for key_info in category.values():
                total_count += 1
                if key_info['status'] == 'configured':
                    configured_count += 1

        self.inventory['total_api_keys_required'] = total_count
        self.inventory['api_keys_configured'] = configured_count

    def calculate_summary_statistics(self):
        """Calculate summary statistics for the inventory"""
        print("📊 Calculating summary statistics...")

        total_models = 0
        providers = {}
        capabilities = {}

        for service_name, service_data in self.inventory['services'].items():
            service_model_count = len(service_data.get('models', {}))
            total_models += service_model_count

            self.inventory['model_summary']['by_service'][service_name] = service_model_count

            # Count by provider
            for model_id, model_data in service_data.get('models', {}).items():
                provider = model_data.get('provider', 'unknown')
                providers[provider] = providers.get(provider, 0) + 1

                # Count capabilities
                model_capabilities = model_data.get('capabilities', [])
                for capability in model_capabilities:
                    capabilities[capability] = capabilities.get(capability, 0) + 1

        self.inventory['total_models_discovered'] = total_models
        self.inventory['model_summary']['by_provider'] = providers
        self.inventory['model_summary']['by_capability'] = capabilities

    def generate_detailed_report(self) -> str:
        """Generate a detailed markdown report"""
        report = f"""# 🏗️ Comprehensive Model Inventory Report
**Generated**: {self.inventory['compilation_date']}
**Compiler Version**: {self.inventory['compiler_version']}

## 📊 Executive Summary

- **Total Services Analyzed**: {self.inventory['total_services_analyzed']}
- **Total Models Discovered**: {self.inventory['total_models_discovered']}
- **API Keys Required**: {self.inventory['total_api_keys_required']}
- **API Keys Configured**: {self.inventory.get('api_keys_configured', 0)}

### Models by Provider
"""

        for provider, count in self.inventory['model_summary']['by_provider'].items():
            report += f"- **{provider}**: {count} models\n"

        report += "\n### Models by Service\n"
        for service, count in self.inventory['model_summary']['by_service'].items():
            report += f"- **{service}**: {count} models\n"

        report += "\n## 🔧 Service Details\n\n"

        for service_name, service_data in self.inventory['services'].items():
            report += f"### {service_name}\n"
            report += f"**Status**: {service_data['status']}\n"
            report += f"**Description**: {service_data['description']}\n"
            report += f"**Models Available**: {len(service_data.get('models', {}))}\n"
            report += f"**API Keys Required**: {', '.join(service_data.get('api_keys_required', []))}\n\n"

            if service_data.get('models'):
                report += "#### Available Models:\n"
                for model_id, model_data in service_data['models'].items():
                    report += f"- **{model_id}**: {model_data.get('name', model_id)} ({model_data.get('provider', 'unknown')})\n"
                report += "\n"

        report += "\n## 🔑 API Keys Inventory\n\n"

        for category, keys in self.inventory['api_keys_inventory'].items():
            report += f"### {category.replace('_', ' ')}\n"
            for key, key_data in keys.items():
                status_emoji = "✅" if key_data['status'] == 'configured' else "❌" if key_data['status'] == 'placeholder' else "⚠️"
                report += f"- {status_emoji} **{key}**: {key_data['status']}\n"
                if key_data['required_for']:
                    report += f"  - Required for: {', '.join(key_data['required_for'])}\n"
            report += "\n"

        return report

    def run_compilation(self):
        """Run the complete model inventory compilation"""
        print("🏗️ Starting comprehensive model inventory compilation...")
        print("=" * 60)

        try:
            # Compile from each service
            self.compile_express_mode_models()
            self.compile_multimodal_chat_models()
            self.compile_chat_routes_models()
            self.compile_multi_model_api()
            self.compile_openai_vertex_models()
            self.compile_pipedream_integration()

            # Compile API keys inventory
            self.compile_api_keys_inventory()

            # Calculate summary statistics
            self.calculate_summary_statistics()

            print("=" * 60)
            print(f"✅ Compilation complete!")
            print(f"📊 Summary:")
            print(f"   - Services analyzed: {self.inventory['total_services_analyzed']}")
            print(f"   - Models discovered: {self.inventory['total_models_discovered']}")
            print(f"   - API keys required: {self.inventory['total_api_keys_required']}")
            print(f"   - API keys configured: {self.inventory.get('api_keys_configured', 0)}")

            return True

        except Exception as e:
            print(f"❌ Compilation failed: {e}")
            return False

    def save_results(self):
        """Save compilation results to files"""
        # Save JSON inventory
        json_file = '/home/woody/CascadeProjects/podplay-scout-alpha/model_inventory_complete.json'
        with open(json_file, 'w') as f:
            json.dump(self.inventory, f, indent=2)
        print(f"💾 JSON inventory saved to: {json_file}")

        # Save markdown report
        markdown_file = '/home/woody/CascadeProjects/podplay-scout-alpha/MODEL_INVENTORY_REPORT.md'
        report = self.generate_detailed_report()
        with open(markdown_file, 'w') as f:
            f.write(report)
        print(f"📝 Markdown report saved to: {markdown_file}")

if __name__ == "__main__":
    compiler = ModelInventoryCompiler()

    if compiler.run_compilation():
        compiler.save_results()
        print("\n🎉 Model inventory compilation completed successfully!")
    else:
        print("\n💥 Model inventory compilation failed!")
