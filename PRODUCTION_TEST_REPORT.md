
╔══════════════════════════════════════════════════════════════╗
║              REVOLUTIONARY AI WORKSPACE                      ║
║                PRODUCTION TEST REPORT                        ║
╚══════════════════════════════════════════════════════════════╝

📊 TEST SUMMARY
─────────────────────────────────────────────────────────────
Total Tests:    28
✅ Passed:      18 (64.3%)
❌ Failed:      6 (21.4%)
⚠️  Warnings:   0 (0.0%)
⏭️  Skipped:    4 (14.3%)

⏱️  Total Time: 6.7 seconds
📅 Date:       2025-06-14 14:46:49

🔍 DETAILED RESULTS
─────────────────────────────────────────────────────────────

🔧 DOCKER (3/3 passed)
   ✅ version_check: PASS (0.10s)
      └─ Docker version: Docker version 28.2.2, build e6534b4
   ✅ context_check: PASS (0.10s)
      └─ Docker Desktop context available
   ✅ compose_config: PASS (0.91s)
      └─ Docker Compose config valid

🔧 OPENAI (0/2 passed)
   ❌ model_gpt-4: FAIL (0.29s)
      └─ HTTP 401: {
    "error": {
        "message": "Incorrect API key provided: sk-proj-********************************************************************************************************************************************************QokA. You can find your API key at https://platform.openai.com/account/api-keys.",
        "type": "invalid_request_error",
        "param": null,
        "code": "invalid_api_key"
    }
}

   ❌ model_gpt-3.5-turbo: FAIL (0.28s)
      └─ HTTP 401: {
    "error": {
        "message": "Incorrect API key provided: sk-proj-********************************************************************************************************************************************************QokA. You can find your API key at https://platform.openai.com/account/api-keys.",
        "type": "invalid_request_error",
        "param": null,
        "code": "invalid_api_key"
    }
}


🔧 ANTHROPIC (0/2 passed)
   ❌ model_claude-3-sonnet: FAIL (0.27s)
      └─ HTTP 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."}}
   ❌ model_claude-3-haiku: FAIL (0.23s)
      └─ HTTP 400: {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."}}

🔧 VERTEX_AI (3/3 passed)
   ✅ service_account: PASS (0.10s)
      └─ Service account file exists
   ✅ express_endpoint: PASS (0.10s)
      └─ Express endpoint configured: 148949740703186944
   ✅ project_config: PASS (0.10s)
      └─ Project ID: podplay-build-beta

🔧 GEMINI (0/2 passed)
   ❌ model_gemini-pro: FAIL (0.13s)
      └─ HTTP 401: {
  "error": {
    "code": 401,
    "message": "API keys are not supported by this API. Expected OAuth2 access token or other authentication credentials that assert a principal. See https://cloud.google.com/docs/authentication",
    "status": "UNAUTHENTICATED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "CREDENTIALS_MISSING",
        "domain": "googleapis.com",
        "metadata": {
          "method": "google.ai.generativelanguage.v1beta.GenerativeService.GenerateContent",
          "service": "generativelanguage.googleapis.com"
        }
      }
    ]
  }
}

   ❌ model_gemini-pro-vision: FAIL (0.08s)
      └─ HTTP 401: {
  "error": {
    "code": 401,
    "message": "API keys are not supported by this API. Expected OAuth2 access token or other authentication credentials that assert a principal. See https://cloud.google.com/docs/authentication",
    "status": "UNAUTHENTICATED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "CREDENTIALS_MISSING",
        "domain": "googleapis.com",
        "metadata": {
          "method": "google.ai.generativelanguage.v1beta.GenerativeService.GenerateContent",
          "service": "generativelanguage.googleapis.com"
        }
      }
    ]
  }
}


🔧 MAMA_BEAR (7/7 passed)
   ✅ variant_creative: PASS (0.50s)
      └─ Variant creative initialized successfully
   ✅ variant_analytical: PASS (0.50s)
      └─ Variant analytical initialized successfully
   ✅ variant_empathetic: PASS (0.50s)
      └─ Variant empathetic initialized successfully
   ✅ variant_strategic: PASS (0.50s)
      └─ Variant strategic initialized successfully
   ✅ variant_technical: PASS (0.50s)
      └─ Variant technical initialized successfully
   ✅ variant_innovative: PASS (0.50s)
      └─ Variant innovative initialized successfully
   ✅ variant_collaborative: PASS (0.50s)
      └─ Variant collaborative initialized successfully

🔧 MEM0 (1/1 passed)
   ✅ api_connection: PASS (0.97s)
      └─ Mem0 API accessible

🔧 PIPEDREAM (2/2 passed)
   ✅ api_key: PASS (0.10s)
      └─ API key configured
   ✅ webhook_setup: PASS (0.10s)
      └─ Webhook configuration prepared

🔧 E2B (1/1 passed)
   ✅ api_key: PASS (0.10s)
      └─ API key configured

🔧 SCRAPYBARA (1/1 passed)
   ✅ api_key: PASS (0.10s)
      └─ API key configured

🔧 BACKEND (0/4 passed)
   ⏭️ endpoint__health: SKIP (0.00s)
      └─ Service not running
   ⏭️ endpoint__api_chat: SKIP (0.00s)
      └─ Service not running
   ⏭️ endpoint__api_mama-bear_variants: SKIP (0.00s)
      └─ Service not running
   ⏭️ endpoint__api_orchestration_status: SKIP (0.00s)
      └─ Service not running

🎯 PRODUCTION READINESS
─────────────────────────────────────────────────────────────
Status: 🔴 NOT PRODUCTION READY

📋 RECOMMENDATIONS
─────────────────────────────────────────────────────────────
• Fix critical AI service failures before production deployment
• Address failed tests to improve system reliability

🚀 NEXT STEPS
─────────────────────────────────────────────────────────────
1. Run full Docker deployment test
2. Perform load testing with concurrent users
3. Set up monitoring and alerting
4. Configure cloud deployment pipeline
5. Test backup and recovery procedures

Generated by Revolutionary AI Workspace Test Suite
Time: 2025-06-14T14:46:49.884236
