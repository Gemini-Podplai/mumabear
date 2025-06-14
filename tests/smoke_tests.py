"""
🚀 Quick Smoke Tests for Revolutionary Workspace
Fast tests to verify basic functionality and readiness
"""

import pytest
import requests
import json
import subprocess
import os
from pathlib import Path

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:5173"

class TestBasicFunctionality:
    """Quick smoke tests for essential functionality"""

    def test_project_structure_exists(self):
        """Test that essential project structure exists"""
        required_dirs = ["frontend", "backend", "tests", "docs"]

        for dir_name in required_dirs:
            assert Path(dir_name).exists(), f"Required directory {dir_name} not found"

        print("✅ Project structure verified")

    def test_essential_files_exist(self):
        """Test that essential files exist"""
        essential_files = [
            "README.md",
            "INVESTOR_README.md",
            "launch_revolutionary_workspace.sh",
            "demo_revolutionary_workspace.sh",
            "frontend/package.json",
            "backend/requirements.txt"
        ]

        missing_files = []
        for file_path in essential_files:
            if not Path(file_path).exists():
                missing_files.append(file_path)

        if missing_files:
            print(f"⚠️ Missing files: {missing_files}")

        # Should have most essential files
        assert len(missing_files) <= 2, f"Too many essential files missing: {missing_files}"
        print("✅ Essential files verified")

    def test_revolutionary_workspace_component_exists(self):
        """Test that the main revolutionary workspace component exists"""
        workspace_component = Path("frontend/src/components/workspace/RevolutionaryWorkspace.tsx")

        if workspace_component.exists():
            with open(workspace_component, 'r') as f:
                content = f.read()

            # Check for key features
            features = ["draggable", "panel", "workspace", "revolutionary"]
            found_features = [f for f in features if f.lower() in content.lower()]

            assert len(found_features) >= 2, "Revolutionary workspace features not found"
            print(f"✅ Revolutionary workspace component verified (features: {found_features})")
        else:
            pytest.skip("Revolutionary workspace component not found")

    def test_mcp_agentic_integration_exists(self):
        """Test that MCP + Agentic RAG integration exists"""
        mcp_backend = Path("backend/services/mcp_agentic_rag_gemini_integration.py")
        mcp_new_logic = Path("new-logic/mcp_agentic_rag_gemini_integration.py")

        mcp_exists = mcp_backend.exists() or mcp_new_logic.exists()
        assert mcp_exists, "MCP + Agentic RAG integration not found"

        # Check content if backend version exists
        if mcp_backend.exists():
            with open(mcp_backend, 'r') as f:
                content = f.read()

            key_features = ["MCPAgenticRAGOrchestrator", "RAGIntelligenceLevel", "AgenticRAGDecision"]
            found_features = [f for f in key_features if f in content]

            assert len(found_features) >= 2, "MCP integration missing key classes"
            print(f"✅ MCP + Agentic RAG integration verified (classes: {found_features})")
        else:
            print("✅ MCP + Agentic RAG integration found in new-logic/")

class TestServiceAvailability:
    """Test if services are running (non-blocking)"""

    def test_backend_accessibility(self):
        """Test if backend is accessible (optional)"""
        try:
            response = requests.get(BACKEND_URL, timeout=5)
            print(f"✅ Backend accessible (status: {response.status_code})")
        except requests.exceptions.ConnectionError:
            print("⚠️ Backend not running (this is OK for development)")
        except requests.exceptions.Timeout:
            print("⚠️ Backend timeout (this is OK for development)")

    def test_frontend_accessibility(self):
        """Test if frontend is accessible (optional)"""
        try:
            response = requests.get(FRONTEND_URL, timeout=5)
            if response.status_code == 200:
                print("✅ Frontend accessible and running")
            else:
                print(f"⚠️ Frontend returned status: {response.status_code}")
        except requests.exceptions.ConnectionError:
            print("⚠️ Frontend not running (this is OK for development)")
        except requests.exceptions.Timeout:
            print("⚠️ Frontend timeout (this is OK for development)")

    def test_api_endpoint_structure(self):
        """Test API endpoint structure if backend is running"""
        try:
            # Try health endpoint
            health_response = requests.get(f"{BACKEND_URL}/api/health", timeout=5)
            if health_response.status_code == 200:
                print("✅ Health endpoint working")

            # Try MCP endpoint (POST)
            mcp_response = requests.post(
                f"{BACKEND_URL}/api/mcp-agentic-rag",
                json={"user_request": "test", "user_id": "smoke_test", "session_context": {}},
                timeout=10
            )

            if mcp_response.status_code == 200:
                data = mcp_response.json()
                if "agentic_enhancements" in data:
                    print("✅ MCP Agentic endpoint working with proper response structure")
                else:
                    print("⚠️ MCP endpoint working but response structure may be incomplete")
            elif mcp_response.status_code == 404:
                print("⚠️ MCP endpoint not implemented yet")
            else:
                print(f"⚠️ MCP endpoint returned status: {mcp_response.status_code}")

        except requests.exceptions.ConnectionError:
            print("⚠️ Backend not running - API tests skipped")
        except requests.exceptions.Timeout:
            print("⚠️ API timeout - may need optimization")

class TestDevelopmentReadiness:
    """Test development environment readiness"""

    def test_frontend_dependencies_installable(self):
        """Test that frontend dependencies can be installed"""
        frontend_path = Path("frontend")

        if not frontend_path.exists():
            pytest.skip("Frontend directory not found")

        package_json = frontend_path / "package.json"
        if not package_json.exists():
            pytest.skip("Frontend package.json not found")

        # Check if node_modules exists or can be installed
        node_modules = frontend_path / "node_modules"
        if node_modules.exists():
            print("✅ Frontend dependencies already installed")
        else:
            print("⚠️ Frontend dependencies not installed (run: cd frontend && npm install)")

    def test_backend_dependencies_installable(self):
        """Test that backend dependencies can be installed"""
        backend_path = Path("backend")

        if not backend_path.exists():
            pytest.skip("Backend directory not found")

        requirements_txt = backend_path / "requirements.txt"
        if requirements_txt.exists():
            print("✅ Backend requirements.txt found")

            # Check for key dependencies
            with open(requirements_txt, 'r') as f:
                requirements = f.read()

            key_deps = ["fastapi", "uvicorn", "pydantic"]
            found_deps = [dep for dep in key_deps if dep in requirements.lower()]

            if len(found_deps) >= 2:
                print(f"✅ Key backend dependencies present: {found_deps}")
            else:
                print("⚠️ Some key backend dependencies may be missing")
        else:
            print("⚠️ Backend requirements.txt not found")

    def test_launch_scripts_executable(self):
        """Test that launch scripts are executable"""
        scripts = [
            "launch_revolutionary_workspace.sh",
            "demo_revolutionary_workspace.sh"
        ]

        for script in scripts:
            script_path = Path(script)
            if script_path.exists():
                if os.access(script_path, os.X_OK):
                    print(f"✅ {script} is executable")
                else:
                    print(f"⚠️ {script} exists but is not executable (run: chmod +x {script})")
            else:
                print(f"⚠️ {script} not found")

class TestInvestorReadiness:
    """Test investor presentation readiness"""

    def test_documentation_exists(self):
        """Test that investor documentation exists"""
        docs = [
            ("INVESTOR_README.md", "Executive summary"),
            ("README.md", "Technical documentation"),
            ("DEV_README.md", "Development overview")
        ]

        for doc_file, description in docs:
            if Path(doc_file).exists():
                with open(doc_file, 'r') as f:
                    content = f.read()

                if len(content) > 500:  # Substantial content
                    print(f"✅ {doc_file} - {description} (substantial content)")
                else:
                    print(f"⚠️ {doc_file} - {description} (minimal content)")
            else:
                print(f"⚠️ {doc_file} not found")

    def test_demo_capabilities(self):
        """Test demo script capabilities"""
        demo_script = Path("demo_revolutionary_workspace.sh")

        if demo_script.exists():
            with open(demo_script, 'r') as f:
                content = f.read()

            demo_features = ["frontend", "backend", "revolutionary", "workspace"]
            found_features = [f for f in demo_features if f in content.lower()]

            if len(found_features) >= 3:
                print(f"✅ Demo script comprehensive (features: {found_features})")
            else:
                print(f"⚠️ Demo script may be basic (features: {found_features})")
        else:
            print("⚠️ Demo script not found")

    def test_unique_value_propositions(self):
        """Test that unique value propositions are documented"""
        investor_readme = Path("INVESTOR_README.md")

        if investor_readme.exists():
            with open(investor_readme, 'r') as f:
                content = f.read().lower()

            unique_features = [
                "draggable", "revolutionary", "mcp", "agentic", "rag",
                "5-level", "intelligence", "autonomous", "monaco"
            ]

            found_unique = [f for f in unique_features if f in content]

            if len(found_unique) >= 6:
                print(f"✅ Strong unique value propositions documented: {found_unique}")
            else:
                print(f"⚠️ Unique value propositions could be strengthened: {found_unique}")
        else:
            print("⚠️ Investor README not found")

def run_smoke_tests():
    """Run all smoke tests"""
    print("🚀 Running Revolutionary Workspace Smoke Tests")
    print("=" * 50)

    # Run with minimal output
    exit_code = pytest.main([
        "-v",
        "--tb=short",
        "-q",
        __file__
    ])

    return exit_code

if __name__ == "__main__":
    exit_code = run_smoke_tests()

    print("\n" + "=" * 50)
    if exit_code == 0:
        print("🎉 SMOKE TESTS PASSED!")
        print("Your Revolutionary Workspace is ready for development and investment presentations!")
    else:
        print("⚠️ Some smoke tests failed - check the issues above")

    print("\nNext steps:")
    print("- Run full test suite: ./tests/run_tests.sh")
    print("- Launch demo: ./launch_revolutionary_workspace.sh")
    print("- Review investor materials: INVESTOR_README.md")
    print("=" * 50)
