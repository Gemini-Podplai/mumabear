# 🔍 Source Code Model Analysis Report
**Generated**: 2025-06-12T09:34:51.863437
**Analyzer Version**: 1.0.0

## 📊 Analysis Summary

- **Files Analyzed**: 49
- **Models Found in Code**: 67
- **API Keys Found in Code**: 13

## 🔥 Most Common Models in Codebase

- **gpt-4o**: Found in 7 file(s)
- **claude-4-opus**: Found in 5 file(s)
- **claude-4-sonnet**: Found in 5 file(s)
- **gpt-4o-mini**: Found in 5 file(s)
- **claude-3.5-sonnet-v2**: Found in 4 file(s)
- **gemini-2.5-flash-preview-05-20**: Found in 4 file(s)
- **claude-3-5-sonnet-20241022**: Found in 4 file(s)
- **claude-3.5-sonnet**: Found in 4 file(s)
- **claude-3.7-sonnet**: Found in 3 file(s)
- **claude-3.5-haiku**: Found in 3 file(s)
- **gemini-2.5-pro-primary**: Found in 3 file(s)
- **gpt-4**: Found in 3 file(s)
- **gpt-3.5-turbo**: Found in 3 file(s)
- **gemini-2.5-pro-preview-06-05**: Found in 3 file(s)
- **gemini-2.5-pro-preview-05-06**: Found in 3 file(s)
- **gemini-2.5-flash-preview-04-17**: Found in 3 file(s)
- **gemini-1.5-pro**: Found in 3 file(s)
- **gemini-1.5-flash**: Found in 3 file(s)
- **gemini-2.5-pro-vertex**: Found in 2 file(s)
- **gemini-2.5-flash-vertex**: Found in 2 file(s)

## 🔑 Most Common API Keys in Codebase

- **GOOGLE_API_KEY**: Found in 5 file(s)
- **ANTHROPIC_API_KEY**: Found in 5 file(s)
- **MEM0_API_KEY**: Found in 3 file(s)
- **SCRAPYBARA_API_KEY**: Found in 3 file(s)
- **scrapybara_api_key**: Found in 3 file(s)
- **OPENAI_API_KEY**: Found in 3 file(s)
- **api_key**: Found in 2 file(s)
- **gemini_api_key**: Found in 2 file(s)
- **openai_api_key**: Found in 1 file(s)
- **PIPEDREAM_API_TOKEN**: Found in 1 file(s)
- **E2B_API_KEY**: Found in 1 file(s)
- **GEMINI_API_KEY**: Found in 1 file(s)
- **GOOGLE_AI_API_KEY**: Found in 1 file(s)

## 📁 Service Files Analysis

### services_express_mode_vertex_integration.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/express_mode_vertex_integration.py`
**Models Found**: 10
  - claude-4-opus
  - claude-4-sonnet
  - claude-3.7-sonnet
  - claude-3.5-sonnet-v2
  - claude-3.5-haiku
  - gemini-2.5-pro-vertex
  - gemini-2.5-pro-preview-0611
  - gemini-2.5-flash-vertex
  - gemini-2.5-flash-preview-0611
  - gemini-2.5-pro-primary
**Classes**: ExecutionMode, ModelProvider, ExpressConfig, VertexModelConfig, ExpressResponse

### services_openai_vertex_integration.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/openai_vertex_integration.py`
**Models Found**: 7
  - gpt-4
  - gpt-4-turbo
  - gpt-4o
  - gpt-4o-mini
  - gpt-3.5-turbo
  - o1-preview
  - o1-mini
**API Keys Found**: 1
  - openai_api_key
**Classes**: OpenAIModelConfig, OpenAIVertexIntegration

### services_enhanced_gemini_scout_orchestration.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/enhanced_gemini_scout_orchestration.py`
**Models Found**: 8
  - gemini-2.5-pro-preview-06-05
  - gemini-2.5-pro-preview-05-06
  - gemini-2.5-pro-preview-03-25
  - gemini-2.5-flash-preview-05-20
  - gemini-2.5-flash-preview-04-17
  - gemini-2.5-flash-preview-04-17-thinking
  - gemini-1.5-pro
  - gemini-1.5-flash
**API Keys Found**: 1
  - GOOGLE_API_KEY
**Classes**: WorkflowStage, ModelTier, QuotaStatus, EnhancedGeminiScoutOrchestrator

### services_mama_bear_model_manager.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/mama_bear_model_manager.py`
**Models Found**: 9
  - gemini-2.5-pro-primary
  - gemini-2.5-pro-preview-05-06
  - gemini-2.5-flash-04-primary
  - gemini-2.5-flash-preview-04-17
  - gemini-2.5-flash-05-primary
  - gemini-2.5-flash-preview-05-20
  - gemini-2.5-pro-backup
  - gemini-2.5-flash-04-backup
  - gemini-2.5-flash-05-backup
**Classes**: ModelPriority, QuotaStatus, ModelConfig, MamaBearResponse, MamaBearModelManager

### services_openai_vertex_service_simple.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/openai_vertex_service_simple.py`
**Models Found**: 7
  - gpt-4o
  - gpt-4o-mini
  - gpt-4
  - gpt-4-turbo
  - gpt-3.5-turbo
  - gemini-1.5-pro
  - gemini-1.5-flash
**Classes**: ModelMetrics, ServiceStatus, OpenAIVertexService

### services_complete_integration.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/complete_integration.py`
**API Keys Found**: 2
  - MEM0_API_KEY
  - SCRAPYBARA_API_KEY
**Classes**: CompleteMamaBearSystem

### services_enhanced_scrapybara_integration.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/enhanced_scrapybara_integration.py`
**API Keys Found**: 1
  - scrapybara_api_key
**Classes**: SessionType, ComputerAction, SharedBrowserSession, ComputerActionRequest, AuthenticationFlow

### services_multi_model_orchestrator.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/multi_model_orchestrator.py`
**Models Found**: 3
  - gpt-4o
  - claude-3-5-sonnet-20241022
  - gemini-2.5-pro-preview-06-05
**API Keys Found**: 3
  - OPENAI_API_KEY
  - ANTHROPIC_API_KEY
  - GOOGLE_API_KEY
**Classes**: ModelProvider, CapabilityType, ModelConfig, FunctionDefinition, MultiModelOrchestrator

### services_mama_bear_config_setup.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/mama_bear_config_setup.py`
**Models Found**: 6
  - gpt-4
  - gpt-3.5-turbo
  - claude-3-5-sonnet-20241022
  - claude-3-haiku-20240307
  - gemini-pro
  - gemini-pro-vision
**API Keys Found**: 5
  - ANTHROPIC_API_KEY
  - GOOGLE_API_KEY
  - OPENAI_API_KEY
  - SCRAPYBARA_API_KEY
  - api_key

### services_mama_bear_memory_system.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/mama_bear_memory_system.py`
**API Keys Found**: 1
  - MEM0_API_KEY
**Classes**: EnhancedMemoryManager, MemoryManager

### services_mama_bear_agentic_superpowers_v3.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/mama_bear_agentic_superpowers_v3.py`
**API Keys Found**: 2
  - api_key
  - MEM0_API_KEY
**Classes**: AgenticCapabilityLevel, AgenticDecisionType, AgenticDomain, AgenticDecision, AgenticPersonality

### services_pipedream_integration_service.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/pipedream_integration_service.py`
**API Keys Found**: 1
  - PIPEDREAM_API_TOKEN
**Classes**: PipedreamIntegrationService

### services_deep_research_center.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/deep_research_center.py`
**Models Found**: 6
  - claude-3-opus-20240229
  - claude-3-5-sonnet-20241022
  - claude-3-haiku-20240307
  - claude-3.5-sonnet
  - gemini-1.5-pro
  - gemini-1.5-flash
**Classes**: ResearchMode, ResearchDepth, DeepResearchCenter, LibrarySection

### services_mama_bear_scrapybara_integration.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/mama_bear_scrapybara_integration.py`
**API Keys Found**: 2
  - scrapybara_api_key
  - SCRAPYBARA_API_KEY
**Classes**: ScrapybaraCapability, MamaBearTask, CollaborativeSession, MamaBearScrapybaraAgent

### services_mama_bear_express_vertex_supercharger.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/mama_bear_express_vertex_supercharger.py`
**Models Found**: 21
  - claude-4-opus
  - claude-4-sonnet
  - claude-3.5-sonnet
  - claude-3.5-sonnet-v2
  - claude-3.7-haiku
  - claude-3.5-haiku
  - claude-3.7-sonnet
  - gemini-2.0-flash-lite-001
  - gemini-2.5-pro-preview-05-06
  - gemini-2.5-flash-preview-04-17
**API Keys Found**: 1
  - gemini_api_key
**Classes**: AgenticDecisionType, ExpressModeLevel, ModelRouting, AgenticDecision, PerformanceMetrics

### services_enhanced_code_execution.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/services/enhanced_code_execution.py`
**API Keys Found**: 1
  - E2B_API_KEY
**Classes**: CodeExecutionResult, EnhancedMamaBearCodeExecution

### api_multimodal_chat_api.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/api/multimodal_chat_api.py`
**Models Found**: 10
  - claude-4
  - claude-4-sonnet
  - claude-4-opus
  - claude-3.5-sonnet-v2
  - gemini-2.0-flash-thinking
  - gemini-1.5-pro-002
  - gemini-1.5-flash-8b
  - gemini-2.0-flash
  - gemini-2.5-flash
  - imagen-3.0-generate-001

### api_library_api.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/api/library_api.py`
**API Keys Found**: 2
  - ANTHROPIC_API_KEY
  - GOOGLE_API_KEY

### api_express_mode_api.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/api/express_mode_api.py`
**Models Found**: 9
  - claude-4-opus
  - claude-4-sonnet
  - claude-3.7-sonnet
  - claude-3.5-sonnet-v2
  - claude-3.5-haiku
  - gemini-2.5-pro-vertex
  - gemini-2.5-flash-vertex
  - gemini-2.5-pro-primary
  - gemini-2.5-flash-backup

### api_mama_bear_scrapybara_api.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/api/mama_bear_scrapybara_api.py`
**API Keys Found**: 1
  - scrapybara_api_key

### api_openai_vertex_api_simple.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/api/openai_vertex_api_simple.py`
**Models Found**: 1
  - gpt-4o

### api_express_mode_vertex_api.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/api/express_mode_vertex_api.py`
**Models Found**: 4
  - claude-3.5-sonnet
  - claude-4-opus
  - claude-4-sonnet
  - claude-3.7-haiku
**API Keys Found**: 1
  - gemini_api_key

### api_gemini_orchestra_api.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/api/gemini_orchestra_api.py`
**API Keys Found**: 3
  - GEMINI_API_KEY
  - GOOGLE_AI_API_KEY
  - ANTHROPIC_API_KEY

### routes_agent_workbench.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/routes/agent_workbench.py`
**Models Found**: 3
  - gpt-4o
  - gpt-4o-mini
  - claude-3-opus

### routes_chat.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/routes/chat.py`
**Models Found**: 18
  - gpt-4o
  - GPT-4o
  - gpt-4o-mini
  - claude-3-opus-20240229
  - claude-3.5-sonnet
  - claude-3
  - claude-3.5
  - claude-3-5-sonnet-20241022
  - gemini-2.5-pro-exp-03-25
  - gemini-2.5-flash-preview-05-20
**API Keys Found**: 3
  - OPENAI_API_KEY
  - ANTHROPIC_API_KEY
  - GOOGLE_API_KEY

### routes_execution_router.py
**File Path**: `/home/woody/CascadeProjects/podplay-scout-alpha/backend/routes/execution_router.py`
**Models Found**: 3
  - gpt-4o
  - gpt-4o-mini
  - claude-3-opus


## ⚙️ Configuration Files

### .env
**Description**: Environment variables
**Environment Variables**: 61/61 configured

### config/settings.py
**Description**: Django/Flask settings

### package.json
**Description**: Node.js dependencies
**Package**: podplay-sanctuary v2.5.0
**Dependencies**: 0 + 2 dev

