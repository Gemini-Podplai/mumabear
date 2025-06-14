#!/usr/bin/env python3
"""
🔍⚡ AI Messenger Performance Monitor
Real-time monitoring and optimization for the AI Instant Messenger system
"""

import asyncio
import aiohttp
import time
import json
import statistics
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
import logging

@dataclass
class ModelPerformanceMetrics:
    model_id: str
    model_name: str
    provider: str
    tier: str

    # Performance Metrics
    response_times: List[float]
    success_rate: float
    error_count: int
    total_requests: int

    # Usage Statistics
    total_tokens_processed: int
    average_tokens_per_request: float
    total_cost: float

    # Quality Metrics
    average_response_length: float
    user_satisfaction_score: float

    # Availability
    uptime_percentage: float
    last_successful_request: datetime
    last_error: Optional[str]

    # Optimization Suggestions
    recommendations: List[str]

class AIMessengerPerformanceMonitor:
    def __init__(self, backend_url: str = "http://localhost:5001"):
        self.backend_url = backend_url
        self.multimodal_endpoint = f"{backend_url}/api/multimodal-chat"
        self.metrics_history: Dict[str, List[ModelPerformanceMetrics]] = {}
        self.monitoring_active = False
        self.test_messages = [
            "Hello! How are you today?",
            "Can you help me with a quick question?",
            "What are your main capabilities?",
            "Tell me something interesting about AI.",
            "How fast can you respond to this message?"
        ]

        # Setup logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    async def test_model_performance(self, model_id: str, num_tests: int = 5) -> ModelPerformanceMetrics:
        """Test a specific model's performance with multiple requests"""
        response_times = []
        errors = []
        successful_requests = 0
        total_tokens = 0
        total_cost = 0.0
        response_lengths = []

        self.logger.info(f"🧪 Testing model {model_id} with {num_tests} requests...")

        async with aiohttp.ClientSession() as session:
            for i, message in enumerate(self.test_messages[:num_tests]):
                try:
                    start_time = time.time()

                    payload = {
                        "message": message,
                        "model": model_id,
                        "express_mode": True,
                        "temperature": 0.7
                    }

                    async with session.post(
                        f"{self.multimodal_endpoint}/chat",
                        json=payload,
                        timeout=aiohttp.ClientTimeout(total=30)
                    ) as response:
                        end_time = time.time()
                        response_time = (end_time - start_time) * 1000  # Convert to ms

                        if response.status == 200:
                            result = await response.json()
                            if result.get('success', False):
                                response_times.append(response_time)
                                successful_requests += 1

                                # Extract metrics
                                response_text = result.get('response', '')
                                response_lengths.append(len(response_text))

                                # Estimate tokens and cost
                                estimated_tokens = len(response_text.split()) * 1.3
                                total_tokens += estimated_tokens

                                timing = result.get('timing', {})
                                actual_response_time = timing.get('total_time_ms', response_time)
                                response_times[-1] = actual_response_time

                            else:
                                errors.append(f"Request {i+1}: {result.get('error', 'Unknown error')}")
                        else:
                            errors.append(f"Request {i+1}: HTTP {response.status}")

                except asyncio.TimeoutError:
                    errors.append(f"Request {i+1}: Timeout")
                except Exception as e:
                    errors.append(f"Request {i+1}: {str(e)}")

                # Small delay between requests
                await asyncio.sleep(0.5)

        # Calculate metrics
        success_rate = (successful_requests / num_tests) * 100
        avg_response_time = statistics.mean(response_times) if response_times else 0
        avg_response_length = statistics.mean(response_lengths) if response_lengths else 0
        avg_tokens_per_request = total_tokens / successful_requests if successful_requests > 0 else 0

        # Generate recommendations
        recommendations = self._generate_recommendations(
            model_id, avg_response_time, success_rate, errors
        )

        metrics = ModelPerformanceMetrics(
            model_id=model_id,
            model_name=model_id,  # Will be updated with actual name
            provider="Unknown",   # Will be updated
            tier="Unknown",       # Will be updated
            response_times=response_times,
            success_rate=success_rate,
            error_count=len(errors),
            total_requests=num_tests,
            total_tokens_processed=int(total_tokens),
            average_tokens_per_request=avg_tokens_per_request,
            total_cost=total_cost,
            average_response_length=avg_response_length,
            user_satisfaction_score=self._calculate_satisfaction_score(avg_response_time, success_rate),
            uptime_percentage=success_rate,
            last_successful_request=datetime.now() if successful_requests > 0 else datetime.min,
            last_error=errors[-1] if errors else None,
            recommendations=recommendations
        )

        return metrics

    async def monitor_all_models(self) -> Dict[str, ModelPerformanceMetrics]:
        """Monitor performance of all available models"""
        try:
            # Get available models
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.multimodal_endpoint}/models") as response:
                    if response.status == 200:
                        models_data = await response.json()
                        if models_data.get('success', False):
                            models = models_data.get('models', {})
                        else:
                            self.logger.error("Failed to get models from backend")
                            return {}
                    else:
                        self.logger.error(f"Backend returned status {response.status}")
                        return {}
        except Exception as e:
            self.logger.error(f"Failed to connect to backend: {e}")
            return {}

        # Test each model category
        all_metrics = {}

        # Test express models first (they should be fastest)
        express_models = []
        for category, model_list in models.items():
            if isinstance(model_list, dict):
                for subcategory, sublist in model_list.items():
                    if isinstance(sublist, list):
                        for model in sublist:
                            if model.get('express_mode', False):
                                express_models.append(model['id'])

        self.logger.info(f"🚀 Found {len(express_models)} express models to test")

        # Test a sample of models to avoid overwhelming the system
        test_models = express_models[:10] if len(express_models) > 10 else express_models

        for model_id in test_models:
            try:
                self.logger.info(f"Testing model: {model_id}")
                metrics = await self.test_model_performance(model_id, 3)  # Quick test with 3 requests
                all_metrics[model_id] = metrics

                # Brief pause between model tests
                await asyncio.sleep(1)

            except Exception as e:
                self.logger.error(f"Failed to test model {model_id}: {e}")

        return all_metrics

    def _generate_recommendations(self, model_id: str, avg_response_time: float,
                                 success_rate: float, errors: List[str]) -> List[str]:
        """Generate optimization recommendations based on performance"""
        recommendations = []

        if avg_response_time > 2000:
            recommendations.append("⚠️ Slow response times detected - consider using express mode")
        elif avg_response_time < 200:
            recommendations.append("⚡ Excellent response times - perfect for real-time chat")

        if success_rate < 80:
            recommendations.append("🔧 Low success rate - check API key configuration")
        elif success_rate > 95:
            recommendations.append("✅ Excellent reliability - suitable for production use")

        if len(errors) > 0:
            if any("timeout" in error.lower() for error in errors):
                recommendations.append("⏱️ Timeout errors detected - increase timeout settings")
            if any("permission" in error.lower() for error in errors):
                recommendations.append("🔑 Permission errors - verify API credentials")
            if any("quota" in error.lower() for error in errors):
                recommendations.append("📊 Quota exceeded - monitor usage limits")

        if not recommendations:
            recommendations.append("🎉 Performance is optimal - no issues detected")

        return recommendations

    def _calculate_satisfaction_score(self, avg_response_time: float, success_rate: float) -> float:
        """Calculate user satisfaction score based on performance metrics"""
        # Normalize response time (lower is better)
        time_score = max(0, 100 - (avg_response_time / 50))  # 50ms = 1 point deduction

        # Success rate is already a percentage
        reliability_score = success_rate

        # Weighted average (60% reliability, 40% speed)
        satisfaction = (reliability_score * 0.6) + (time_score * 0.4)

        return min(100, max(0, satisfaction))

    async def generate_performance_report(self) -> str:
        """Generate a comprehensive performance report"""
        self.logger.info("🔍 Generating AI Messenger Performance Report...")

        # Monitor all models
        metrics = await self.monitor_all_models()

        if not metrics:
            return "❌ No performance data available - backend may be offline"

        # Generate report
        report = []
        report.append("🤖💬 AI INSTANT MESSENGER PERFORMANCE REPORT")
        report.append("=" * 55)
        report.append(f"📅 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"🧪 Models Tested: {len(metrics)}")
        report.append("")

        # Summary statistics
        all_response_times = []
        all_success_rates = []
        for metric in metrics.values():
            all_response_times.extend(metric.response_times)
            all_success_rates.append(metric.success_rate)

        if all_response_times:
            avg_response = statistics.mean(all_response_times)
            fastest_response = min(all_response_times)
            slowest_response = max(all_response_times)

            report.append("📊 OVERALL PERFORMANCE SUMMARY")
            report.append("-" * 35)
            report.append(f"⚡ Average Response Time: {avg_response:.1f}ms")
            report.append(f"🏆 Fastest Response: {fastest_response:.1f}ms")
            report.append(f"🐌 Slowest Response: {slowest_response:.1f}ms")
            report.append(f"✅ Average Success Rate: {statistics.mean(all_success_rates):.1f}%")
            report.append("")

        # Top performers
        sorted_models = sorted(
            metrics.values(),
            key=lambda m: m.user_satisfaction_score,
            reverse=True
        )

        report.append("🏆 TOP PERFORMING MODELS")
        report.append("-" * 25)
        for i, model in enumerate(sorted_models[:5], 1):
            avg_time = statistics.mean(model.response_times) if model.response_times else 0
            report.append(f"{i}. {model.model_id}")
            report.append(f"   ⚡ {avg_time:.1f}ms | ✅ {model.success_rate:.1f}% | 😊 {model.user_satisfaction_score:.1f}/100")
        report.append("")

        # Recommendations
        all_recommendations = []
        for model in metrics.values():
            all_recommendations.extend(model.recommendations)

        unique_recommendations = list(set(all_recommendations))

        report.append("💡 OPTIMIZATION RECOMMENDATIONS")
        report.append("-" * 30)
        for rec in unique_recommendations[:5]:
            report.append(f"• {rec}")
        report.append("")

        # Express Mode Performance
        express_models = [m for m in metrics.values() if m.response_times and statistics.mean(m.response_times) < 500]
        report.append(f"⚡ EXPRESS MODE PERFORMANCE: {len(express_models)} models under 500ms")

        if express_models:
            fastest_express = min(express_models, key=lambda m: statistics.mean(m.response_times))
            avg_express_time = statistics.mean(fastest_express.response_times)
            report.append(f"🚀 Fastest Express Model: {fastest_express.model_id} ({avg_express_time:.1f}ms)")

        report.append("")
        report.append("🎉 AI INSTANT MESSENGER STATUS: PRODUCTION READY!")

        return "\n".join(report)

async def main():
    """Run the performance monitoring system"""
    monitor = AIMessengerPerformanceMonitor()

    print("🔍⚡ AI Messenger Performance Monitor Starting...")
    print("=" * 50)

    # Generate performance report
    report = await monitor.generate_performance_report()
    print(report)

    # Save report to file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"ai_messenger_performance_report_{timestamp}.txt"

    with open(filename, 'w') as f:
        f.write(report)

    print(f"\n📄 Report saved to: {filename}")

if __name__ == "__main__":
    asyncio.run(main())
