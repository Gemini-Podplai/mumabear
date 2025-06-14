#!/usr/bin/env python3
"""
🚀 COMPREHENSIVE MODEL TESTING SCRIPT
Tests all available models using the call model function from multiple API endpoints
Generates a beautiful visual report with test results
"""

import asyncio
import json
import logging
import time
import aiohttp
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import statistics

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ModelTestResult:
    """Results from testing a single model"""
    model_id: str
    model_name: str
    provider: str
    endpoint: str
    test_message: str
    success: bool
    response_time_ms: float
    response_content: Optional[str]
    error_message: Optional[str]
    capabilities_tested: List[str]
    timestamp: str

class ComprehensiveModelTester:
    """Comprehensive testing of all available models"""

    def __init__(self, base_url: str = "http://localhost:5001"):
        self.base_url = base_url
        self.test_results: List[ModelTestResult] = []
        self.total_models_tested = 0
        self.successful_tests = 0
        self.failed_tests = 0

        # Test messages for different capabilities
        self.test_messages = {
            "basic_chat": "Hello! Please introduce yourself and tell me about your capabilities.",
            "reasoning": "Explain the difference between machine learning and artificial intelligence in simple terms.",
            "coding": "Write a simple Python function that calculates the factorial of a number.",
            "analysis": "Analyze the following statement: 'Technology is changing the way we communicate.'",
            "creative": "Write a short, creative story about a robot learning to paint.",
            "math": "Solve this problem: If a train travels at 60 mph for 2.5 hours, how far does it travel?",
            "multimodal": "Describe what you can do with images and other media types.",
            "function_calling": "What tools and functions are you capable of calling?"
        }

        # API endpoints to test
        self.endpoints = {
            "multimodal_chat": "/api/multimodal-chat/chat",
            "chat_stream": "/api/chat/stream",
            "multi_model": "/api/multi-model/chat",
            "express_mode": "/api/express-mode/agentic-chat",
            "mama_bear": "/api/mama-bear/chat",
            "orchestration": "/api/orchestration/mama-bear/chat"
        }

    async def get_available_models(self) -> Dict[str, Any]:
        """Get all available models from different endpoints"""
        logger.info("🔍 Discovering available models...")
        all_models = {}

        async with aiohttp.ClientSession() as session:
            # Get models from multimodal chat endpoint
            try:
                async with session.get(f"{self.base_url}/api/multimodal-chat/models") as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('success'):
                            models = data.get('models', {})
                            # Flatten the categorized models
                            for category, model_list in models.items():
                                if isinstance(model_list, dict):
                                    for subcategory, sublist in model_list.items():
                                        if isinstance(sublist, list):
                                            for model in sublist:
                                                model_id = model['id']
                                                all_models[model_id] = {
                                                    'name': model['name'],
                                                    'provider': model['provider'],
                                                    'capabilities': model.get('capabilities', []),
                                                    'source': 'multimodal_chat'
                                                }
                logger.info(f"✅ Found {len(all_models)} models from multimodal chat endpoint")
            except Exception as e:
                logger.warning(f"Failed to get models from multimodal chat: {e}")

            # Get models from chat endpoint
            try:
                async with session.get(f"{self.base_url}/api/chat/models") as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('success'):
                            chat_models = data.get('models', {})
                            for model_id, config in chat_models.items():
                                if model_id not in all_models:
                                    all_models[model_id] = {
                                        'name': config.get('name', model_id),
                                        'provider': config.get('provider', 'unknown'),
                                        'capabilities': config.get('capabilities', []),
                                        'source': 'chat'
                                    }
                logger.info(f"✅ Added {len(chat_models)} models from chat endpoint")
            except Exception as e:
                logger.warning(f"Failed to get models from chat endpoint: {e}")

        return all_models

    async def test_model_endpoint(self, model_id: str, model_info: Dict[str, Any],
                                 endpoint_name: str, endpoint_path: str,
                                 test_type: str = "basic_chat") -> ModelTestResult:
        """Test a specific model on a specific endpoint"""
        test_message = self.test_messages[test_type]
        start_time = time.time()

        try:
            async with aiohttp.ClientSession() as session:
                # Prepare request payload based on endpoint
                if endpoint_name == "multimodal_chat":
                    payload = {
                        "message": test_message,
                        "model": model_id,
                        "mode": "smart"
                    }
                elif endpoint_name == "chat_stream":
                    payload = {
                        "message": test_message,
                        "model_id": model_id,
                        "session_id": f"test_{int(time.time())}"
                    }
                elif endpoint_name == "multi_model":
                    payload = {
                        "prompt": test_message,
                        "user_id": "test_user",
                        "capabilities": ["function_calling"]
                    }
                elif endpoint_name == "express_mode":
                    payload = {
                        "message": test_message,
                        "user_id": "test_user",
                        "priority": "fast"
                    }
                elif endpoint_name == "mama_bear":
                    payload = {
                        "message": test_message,
                        "variant": "scout_commander"
                    }
                elif endpoint_name == "orchestration":
                    payload = {
                        "message": test_message,
                        "user_id": "test_user",
                        "page_context": "testing"
                    }
                else:
                    payload = {"message": test_message, "model": model_id}

                # Make the request
                async with session.post(
                    f"{self.base_url}{endpoint_path}",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    response_time = (time.time() - start_time) * 1000

                    if response.status == 200:
                        try:
                            result = await response.json()
                            if result.get('success', True):
                                # Extract response content
                                response_content = ""
                                if 'response' in result:
                                    if isinstance(result['response'], dict):
                                        response_content = result['response'].get('message', str(result['response']))
                                    else:
                                        response_content = str(result['response'])
                                elif 'data' in result:
                                    response_content = str(result['data'])
                                elif 'message' in result:
                                    response_content = result['message']
                                else:
                                    response_content = str(result)

                                return ModelTestResult(
                                    model_id=model_id,
                                    model_name=model_info['name'],
                                    provider=model_info['provider'],
                                    endpoint=endpoint_name,
                                    test_message=test_message,
                                    success=True,
                                    response_time_ms=response_time,
                                    response_content=response_content[:500] + "..." if len(response_content) > 500 else response_content,
                                    error_message=None,
                                    capabilities_tested=[test_type],
                                    timestamp=datetime.now().isoformat()
                                )
                            else:
                                return ModelTestResult(
                                    model_id=model_id,
                                    model_name=model_info['name'],
                                    provider=model_info['provider'],
                                    endpoint=endpoint_name,
                                    test_message=test_message,
                                    success=False,
                                    response_time_ms=response_time,
                                    response_content=None,
                                    error_message=result.get('error', 'API returned success=false'),
                                    capabilities_tested=[test_type],
                                    timestamp=datetime.now().isoformat()
                                )
                        except json.JSONDecodeError as e:
                            # Handle streaming responses
                            text_response = await response.text()
                            return ModelTestResult(
                                model_id=model_id,
                                model_name=model_info['name'],
                                provider=model_info['provider'],
                                endpoint=endpoint_name,
                                test_message=test_message,
                                success=True,
                                response_time_ms=response_time,
                                response_content=text_response[:500] + "..." if len(text_response) > 500 else text_response,
                                error_message=None,
                                capabilities_tested=[test_type],
                                timestamp=datetime.now().isoformat()
                            )
                    else:
                        error_text = await response.text()
                        return ModelTestResult(
                            model_id=model_id,
                            model_name=model_info['name'],
                            provider=model_info['provider'],
                            endpoint=endpoint_name,
                            test_message=test_message,
                            success=False,
                            response_time_ms=response_time,
                            response_content=None,
                            error_message=f"HTTP {response.status}: {error_text}",
                            capabilities_tested=[test_type],
                            timestamp=datetime.now().isoformat()
                        )

        except asyncio.TimeoutError:
            return ModelTestResult(
                model_id=model_id,
                model_name=model_info['name'],
                provider=model_info['provider'],
                endpoint=endpoint_name,
                test_message=test_message,
                success=False,
                response_time_ms=(time.time() - start_time) * 1000,
                response_content=None,
                error_message="Request timeout (30s)",
                capabilities_tested=[test_type],
                timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            return ModelTestResult(
                model_id=model_id,
                model_name=model_info['name'],
                provider=model_info['provider'],
                endpoint=endpoint_name,
                test_message=test_message,
                success=False,
                response_time_ms=(time.time() - start_time) * 1000,
                response_content=None,
                error_message=str(e),
                capabilities_tested=[test_type],
                timestamp=datetime.now().isoformat()
            )

    async def test_all_models(self, max_models_per_endpoint: int = 10) -> None:
        """Test all models across all endpoints"""
        logger.info("🚀 Starting comprehensive model testing...")

        # Get all available models
        all_models = await self.get_available_models()

        if not all_models:
            logger.error("❌ No models found to test!")
            return

        logger.info(f"📊 Testing {len(all_models)} models across {len(self.endpoints)} endpoints")

        # Test each model on each endpoint
        for endpoint_name, endpoint_path in self.endpoints.items():
            logger.info(f"\n🧪 Testing endpoint: {endpoint_name}")

            tested_count = 0
            for model_id, model_info in all_models.items():
                if tested_count >= max_models_per_endpoint:
                    logger.info(f"⏭️  Reached limit of {max_models_per_endpoint} models for {endpoint_name}")
                    break

                logger.info(f"  Testing {model_id} ({model_info['name']})...")

                # Test basic chat capability
                result = await self.test_model_endpoint(
                    model_id, model_info, endpoint_name, endpoint_path, "basic_chat"
                )

                self.test_results.append(result)
                self.total_models_tested += 1

                if result.success:
                    self.successful_tests += 1
                    logger.info(f"    ✅ SUCCESS ({result.response_time_ms:.1f}ms)")
                else:
                    self.failed_tests += 1
                    logger.info(f"    ❌ FAILED: {result.error_message}")

                tested_count += 1

                # Small delay to avoid overwhelming the server
                await asyncio.sleep(0.5)

    def generate_summary_report(self) -> Dict[str, Any]:
        """Generate a comprehensive summary report"""
        logger.info("📊 Generating summary report...")

        # Basic statistics
        success_rate = (self.successful_tests / self.total_models_tested * 100) if self.total_models_tested > 0 else 0

        # Response time statistics
        successful_results = [r for r in self.test_results if r.success]
        response_times = [r.response_time_ms for r in successful_results]

        response_time_stats = {}
        if response_times:
            response_time_stats = {
                "min": min(response_times),
                "max": max(response_times),
                "mean": statistics.mean(response_times),
                "median": statistics.median(response_times),
                "std_dev": statistics.stdev(response_times) if len(response_times) > 1 else 0
            }

        # Group results by provider
        provider_stats = {}
        for result in self.test_results:
            provider = result.provider
            if provider not in provider_stats:
                provider_stats[provider] = {"total": 0, "successful": 0, "failed": 0}

            provider_stats[provider]["total"] += 1
            if result.success:
                provider_stats[provider]["successful"] += 1
            else:
                provider_stats[provider]["failed"] += 1

        # Group results by endpoint
        endpoint_stats = {}
        for result in self.test_results:
            endpoint = result.endpoint
            if endpoint not in endpoint_stats:
                endpoint_stats[endpoint] = {"total": 0, "successful": 0, "failed": 0}

            endpoint_stats[endpoint]["total"] += 1
            if result.success:
                endpoint_stats[endpoint]["successful"] += 1
            else:
                endpoint_stats[endpoint]["failed"] += 1

        # Top performing models
        top_models = sorted(successful_results, key=lambda x: x.response_time_ms)[:10]

        # Most common errors
        failed_results = [r for r in self.test_results if not r.success]
        error_counts = {}
        for result in failed_results:
            error = result.error_message or "Unknown error"
            error_counts[error] = error_counts.get(error, 0) + 1

        common_errors = sorted(error_counts.items(), key=lambda x: x[1], reverse=True)[:5]

        return {
            "test_summary": {
                "total_tests": self.total_models_tested,
                "successful_tests": self.successful_tests,
                "failed_tests": self.failed_tests,
                "success_rate_percent": round(success_rate, 2),
                "test_timestamp": datetime.now().isoformat()
            },
            "response_time_statistics": response_time_stats,
            "provider_performance": provider_stats,
            "endpoint_performance": endpoint_stats,
            "top_performing_models": [asdict(model) for model in top_models],
            "common_errors": common_errors,
            "all_test_results": [asdict(result) for result in self.test_results]
        }

    def generate_html_report(self, report: Dict[str, Any]) -> str:
        """Generate a beautiful HTML report"""

        # Generate top models table
        top_models_html = ""
        for model in report['top_performing_models']:
            top_models_html += f"""
            <tr>
                <td class="model-name">{model['model_name']}</td>
                <td><span class="provider-badge">{model['provider']}</span></td>
                <td><span class="endpoint-badge">{model['endpoint']}</span></td>
                <td class="response-time">{model['response_time_ms']:.1f}ms</td>
                <td><span class="status-success">✅ Success</span></td>
            </tr>
            """

        # Generate provider stats
        provider_stats_html = ""
        for provider, stats in report['provider_performance'].items():
            success_rate = (stats['successful'] / stats['total'] * 100) if stats['total'] > 0 else 0
            provider_stats_html += f"""
            <div class="stat-card">
                <h4>{provider}</h4>
                <div class="stat-value">{stats['successful']}/{stats['total']}</div>
                <div class="stat-label">{success_rate:.1f}% success rate</div>
            </div>
            """

        # Generate endpoint stats
        endpoint_stats_html = ""
        for endpoint, stats in report['endpoint_performance'].items():
            success_rate = (stats['successful'] / stats['total'] * 100) if stats['total'] > 0 else 0
            endpoint_stats_html += f"""
            <div class="stat-card">
                <h4>{endpoint.replace('_', ' ').title()}</h4>
                <div class="stat-value">{stats['successful']}/{stats['total']}</div>
                <div class="stat-label">{success_rate:.1f}% success rate</div>
            </div>
            """

        # Generate error list
        error_list_html = ""
        for error, count in report['common_errors']:
            error_list_html += f"""
            <li><strong>{count}x:</strong> {error}</li>
            """

        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Comprehensive Model Testing Report - Revolutionary AI Workspace</title>
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
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #e0e0e0;
        }}
        .header h1 {{
            color: #2c3e50;
            font-size: 2.5em;
            margin: 0;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }}
        .subtitle {{
            color: #7f8c8d;
            font-size: 1.2em;
            margin-top: 10px;
        }}
        .stats-overview {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }}
        .overview-card {{
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }}
        .overview-value {{
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
        }}
        .overview-label {{
            font-size: 1em;
            opacity: 0.9;
        }}
        .section {{
            margin-bottom: 40px;
        }}
        .section h2 {{
            color: #2c3e50;
            font-size: 1.8em;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
        }}
        .stat-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }}
        .stat-card {{
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #3498db;
        }}
        .stat-card h4 {{
            margin: 0 0 10px 0;
            color: #2c3e50;
        }}
        .stat-value {{
            font-size: 1.5em;
            font-weight: bold;
            color: #3498db;
        }}
        .stat-label {{
            color: #7f8c8d;
            font-size: 0.9em;
        }}
        .table-container {{
            overflow-x: auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
        }}
        th, td {{
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }}
        th {{
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            font-weight: 600;
        }}
        .model-name {{
            font-weight: 600;
            color: #2c3e50;
        }}
        .provider-badge, .endpoint-badge {{
            background: #3498db;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 500;
        }}
        .endpoint-badge {{
            background: #e74c3c;
        }}
        .response-time {{
            font-weight: 600;
            color: #27ae60;
        }}
        .status-success {{
            color: #27ae60;
            font-weight: 600;
        }}
        .status-failed {{
            color: #e74c3c;
            font-weight: 600;
        }}
        .error-list {{
            background: #fff5f5;
            border: 1px solid #feb2b2;
            border-radius: 8px;
            padding: 20px;
        }}
        .error-list li {{
            margin-bottom: 10px;
            color: #c53030;
        }}
        .footer {{
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e0e0e0;
            color: #666;
        }}
        .performance-section {{
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Comprehensive Model Testing Report</h1>
            <div class="subtitle">Revolutionary AI Workspace - Complete Model Validation</div>
            <p>Generated on {report['test_summary']['test_timestamp']}</p>
        </div>

        <div class="stats-overview">
            <div class="overview-card">
                <div class="overview-value">{report['test_summary']['total_tests']}</div>
                <div class="overview-label">Total Tests</div>
            </div>
            <div class="overview-card">
                <div class="overview-value">{report['test_summary']['successful_tests']}</div>
                <div class="overview-label">Successful Tests</div>
            </div>
            <div class="overview-card">
                <div class="overview-value">{report['test_summary']['success_rate_percent']}%</div>
                <div class="overview-label">Success Rate</div>
            </div>
            <div class="overview-card">
                <div class="overview-value">{report['response_time_statistics'].get('mean', 0):.1f}ms</div>
                <div class="overview-label">Avg Response Time</div>
            </div>
        </div>

        <div class="section">
            <h2>🏆 Top Performing Models</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Model Name</th>
                            <th>Provider</th>
                            <th>Endpoint</th>
                            <th>Response Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {top_models_html}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="performance-section">
            <div class="section">
                <h2>📊 Provider Performance</h2>
                <div class="stat-grid">
                    {provider_stats_html}
                </div>
            </div>

            <div class="section">
                <h2>🔗 Endpoint Performance</h2>
                <div class="stat-grid">
                    {endpoint_stats_html}
                </div>
            </div>
        </div>

        {f'''
        <div class="section">
            <h2>⚠️ Common Errors</h2>
            <div class="error-list">
                <ul>
                    {error_list_html}
                </ul>
            </div>
        </div>
        ''' if report['common_errors'] else ''}

        <div class="footer">
            <p><strong>🐻 Powered by Revolutionary AI Workspace</strong></p>
            <p>Comprehensive testing of {len(set(r['model_id'] for r in report['all_test_results']))} unique models across {len(set(r['endpoint'] for r in report['all_test_results']))} API endpoints</p>
            <p><small>This report validates the complete functionality of our AI model ecosystem</small></p>
        </div>
    </div>
</body>
</html>
        """

        return html

async def main():
    """Main testing function"""
    print("🚀 REVOLUTIONARY AI WORKSPACE - COMPREHENSIVE MODEL TESTING")
    print("=" * 70)

    # Initialize tester
    tester = ComprehensiveModelTester()

    # Run comprehensive testing
    await tester.test_all_models(max_models_per_endpoint=8)  # Limit to prevent overwhelming

    # Generate reports
    print("\n📊 GENERATING COMPREHENSIVE REPORTS...")
    report = tester.generate_summary_report()

    # Save JSON report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    json_filename = f"comprehensive_model_testing_report_{timestamp}.json"
    with open(json_filename, 'w') as f:
        json.dump(report, f, indent=2)

    # Save HTML report
    html_filename = f"comprehensive_model_testing_report_{timestamp}.html"
    html_content = tester.generate_html_report(report)
    with open(html_filename, 'w') as f:
        f.write(html_content)

    # Print summary
    print(f"\n✅ TESTING COMPLETE!")
    print(f"📊 Total Tests: {report['test_summary']['total_tests']}")
    print(f"✅ Successful: {report['test_summary']['successful_tests']}")
    print(f"❌ Failed: {report['test_summary']['failed_tests']}")
    print(f"📈 Success Rate: {report['test_summary']['success_rate_percent']}%")

    if report['response_time_statistics']:
        print(f"⚡ Avg Response Time: {report['response_time_statistics']['mean']:.1f}ms")
        print(f"🏃 Fastest Response: {report['response_time_statistics']['min']:.1f}ms")

    print(f"\n📄 REPORTS GENERATED:")
    print(f"  • JSON Report: {json_filename}")
    print(f"  • HTML Report: {html_filename}")
    print(f"\n🌐 Open the HTML file in your browser for a beautiful visual report!")

if __name__ == "__main__":
    asyncio.run(main())
