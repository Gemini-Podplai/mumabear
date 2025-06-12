#!/usr/bin/env python3
"""
🔍 Source Code Model Analyzer
Analyzes service source files directly to find ALL model configurations
that might not be exposed through APIs
"""

import json
import os
import re
from datetime import datetime
from typing import Dict, List, Any, Set
import ast

class SourceCodeModelAnalyzer:
    def __init__(self):
        self.backend_dir = '/home/woody/CascadeProjects/podplay-scout-alpha/backend'
        self.analysis = {
            'analysis_date': datetime.now().isoformat(),
            'analyzer_version': '1.0.0',
            'total_files_analyzed': 0,
            'total_models_found_in_code': 0,
            'service_files': {},
            'model_patterns_found': {},
            'api_key_patterns_found': {},
            'configuration_files': {}
        }

    def analyze_python_file(self, file_path: str) -> Dict[str, Any]:
        """Analyze a Python file for model configurations and API keys"""
        analysis = {
            'file_path': file_path,
            'models_found': {},
            'api_keys_found': set(),
            'model_patterns': [],
            'api_key_patterns': [],
            'imports': set(),
            'classes': [],
            'functions': []
        }

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find model patterns
            model_patterns = [
                r'["\']gpt-[\w\.-]+["\']',
                r'["\']claude-[\w\.-]+["\']',
                r'["\']gemini-[\w\.-]+["\']',
                r'["\']gemma-[\w\.-]+["\']',
                r'["\']imagen-[\w\.-]+["\']',
                r'["\']text-[\w\.-]+["\']',
                r'["\']davinci-[\w\.-]+["\']',
                r'["\']o1-[\w\.-]+["\']'
            ]

            for pattern in model_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                for match in matches:
                    model_name = match.strip('"\'')
                    analysis['models_found'][model_name] = {
                        'found_in_context': 'source_code',
                        'pattern_matched': pattern
                    }
                    analysis['model_patterns'].append(model_name)

            # Find API key patterns
            api_key_patterns = [
                r'["\'][\w_]*API_KEY["\']',
                r'["\'][\w_]*_API_KEY["\']',
                r'os\.getenv\(["\']([^"\']+)["\']',
                r'config\.get\(["\']([^"\']+)["\']',
                r'["\'][\w_]*TOKEN["\']',
                r'["\'][\w_]*_TOKEN["\']'
            ]

            for pattern in api_key_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                for match in matches:
                    key_name = match.strip('"\'') if isinstance(match, str) else match
                    if key_name.upper().endswith(('_KEY', '_TOKEN', 'API_KEY')):
                        analysis['api_keys_found'].add(key_name)
                        analysis['api_key_patterns'].append(key_name)

            # Find imports
            import_patterns = [
                r'import\s+([\w\.]+)',
                r'from\s+([\w\.]+)\s+import'
            ]

            for pattern in import_patterns:
                matches = re.findall(pattern, content)
                analysis['imports'].update(matches)

            # Parse AST for more detailed analysis
            try:
                tree = ast.parse(content)
                for node in ast.walk(tree):
                    if isinstance(node, ast.ClassDef):
                        analysis['classes'].append(node.name)
                    elif isinstance(node, ast.FunctionDef):
                        analysis['functions'].append(node.name)
            except:
                pass  # Skip AST parsing if it fails

        except Exception as e:
            analysis['error'] = str(e)

        # Convert sets to lists for JSON serialization
        analysis['api_keys_found'] = list(analysis['api_keys_found'])
        analysis['imports'] = list(analysis['imports'])

        return analysis

    def analyze_service_files(self):
        """Analyze all service files in the backend"""
        services_dir = os.path.join(self.backend_dir, 'services')
        api_dir = os.path.join(self.backend_dir, 'api')
        routes_dir = os.path.join(self.backend_dir, 'routes')

        directories_to_analyze = [
            ('services', services_dir),
            ('api', api_dir),
            ('routes', routes_dir)
        ]

        for dir_type, directory in directories_to_analyze:
            if os.path.exists(directory):
                print(f"🔍 Analyzing {dir_type} directory: {directory}")

                for filename in os.listdir(directory):
                    if filename.endswith('.py') and not filename.startswith('__'):
                        file_path = os.path.join(directory, filename)
                        print(f"  📁 Analyzing: {filename}")

                        analysis = self.analyze_python_file(file_path)
                        service_key = f"{dir_type}_{filename}"
                        self.analysis['service_files'][service_key] = analysis

                        # Aggregate models found
                        for model_name in analysis['models_found']:
                            if model_name not in self.analysis['model_patterns_found']:
                                self.analysis['model_patterns_found'][model_name] = []
                            self.analysis['model_patterns_found'][model_name].append(service_key)

                        # Aggregate API keys found
                        for api_key in analysis['api_keys_found']:
                            if api_key not in self.analysis['api_key_patterns_found']:
                                self.analysis['api_key_patterns_found'][api_key] = []
                            self.analysis['api_key_patterns_found'][api_key].append(service_key)

                        self.analysis['total_files_analyzed'] += 1

    def analyze_configuration_files(self):
        """Analyze configuration files"""
        config_files = [
            ('.env', 'Environment variables'),
            ('config/settings.py', 'Django/Flask settings'),
            ('requirements.txt', 'Python dependencies'),
            ('package.json', 'Node.js dependencies')
        ]

        for filename, description in config_files:
            file_path = os.path.join('/home/woody/CascadeProjects/podplay-scout-alpha', filename)
            if filename.startswith('config/'):
                file_path = os.path.join(self.backend_dir, filename)

            if os.path.exists(file_path):
                print(f"📋 Analyzing config file: {filename}")

                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    config_analysis = {
                        'description': description,
                        'file_path': file_path,
                        'content_length': len(content),
                        'lines': len(content.split('\n'))
                    }

                    if filename == '.env':
                        # Parse environment variables
                        env_vars = {}
                        for line in content.split('\n'):
                            line = line.strip()
                            if '=' in line and not line.startswith('#'):
                                key, value = line.split('=', 1)
                                env_vars[key] = {
                                    'has_value': bool(value and value != 'your_key_here'),
                                    'is_placeholder': value.endswith('_here') or value == 'your_key_here'
                                }
                        config_analysis['environment_variables'] = env_vars

                    elif filename == 'requirements.txt':
                        # Parse Python dependencies
                        dependencies = []
                        for line in content.split('\n'):
                            line = line.strip()
                            if line and not line.startswith('#'):
                                dependencies.append(line)
                        config_analysis['python_dependencies'] = dependencies

                    elif filename == 'package.json':
                        # Parse package.json
                        try:
                            import json
                            package_data = json.loads(content)
                            config_analysis['package_info'] = {
                                'name': package_data.get('name'),
                                'version': package_data.get('version'),
                                'dependencies_count': len(package_data.get('dependencies', {})),
                                'dev_dependencies_count': len(package_data.get('devDependencies', {}))
                            }
                        except:
                            config_analysis['parse_error'] = 'Failed to parse JSON'

                    self.analysis['configuration_files'][filename] = config_analysis

                except Exception as e:
                    self.analysis['configuration_files'][filename] = {
                        'description': description,
                        'error': str(e)
                    }

    def calculate_statistics(self):
        """Calculate final statistics"""
        total_models = len(self.analysis['model_patterns_found'])
        total_api_keys = len(self.analysis['api_key_patterns_found'])

        self.analysis['total_models_found_in_code'] = total_models
        self.analysis['total_api_keys_found_in_code'] = total_api_keys

        # Find most common models
        model_frequency = {}
        for model_name, files in self.analysis['model_patterns_found'].items():
            model_frequency[model_name] = len(files)

        # Sort by frequency
        self.analysis['most_common_models'] = dict(
            sorted(model_frequency.items(), key=lambda x: x[1], reverse=True)[:20]
        )

        # Find most common API keys
        api_key_frequency = {}
        for api_key, files in self.analysis['api_key_patterns_found'].items():
            api_key_frequency[api_key] = len(files)

        self.analysis['most_common_api_keys'] = dict(
            sorted(api_key_frequency.items(), key=lambda x: x[1], reverse=True)[:20]
        )

    def generate_source_analysis_report(self) -> str:
        """Generate detailed source code analysis report"""
        report = f"""# 🔍 Source Code Model Analysis Report
**Generated**: {self.analysis['analysis_date']}
**Analyzer Version**: {self.analysis['analyzer_version']}

## 📊 Analysis Summary

- **Files Analyzed**: {self.analysis['total_files_analyzed']}
- **Models Found in Code**: {self.analysis['total_models_found_in_code']}
- **API Keys Found in Code**: {self.analysis.get('total_api_keys_found_in_code', 0)}

## 🔥 Most Common Models in Codebase

"""

        for model, frequency in self.analysis.get('most_common_models', {}).items():
            report += f"- **{model}**: Found in {frequency} file(s)\n"

        report += "\n## 🔑 Most Common API Keys in Codebase\n\n"

        for api_key, frequency in self.analysis.get('most_common_api_keys', {}).items():
            report += f"- **{api_key}**: Found in {frequency} file(s)\n"

        report += "\n## 📁 Service Files Analysis\n\n"

        for service_key, service_data in self.analysis['service_files'].items():
            if service_data.get('models_found') or service_data.get('api_keys_found'):
                report += f"### {service_key}\n"
                report += f"**File Path**: `{service_data['file_path']}`\n"

                if service_data.get('models_found'):
                    report += f"**Models Found**: {len(service_data['models_found'])}\n"
                    for model in list(service_data['models_found'].keys())[:10]:  # Limit to first 10
                        report += f"  - {model}\n"

                if service_data.get('api_keys_found'):
                    report += f"**API Keys Found**: {len(service_data['api_keys_found'])}\n"
                    for api_key in service_data['api_keys_found'][:5]:  # Limit to first 5
                        report += f"  - {api_key}\n"

                if service_data.get('classes'):
                    report += f"**Classes**: {', '.join(service_data['classes'][:5])}\n"

                report += "\n"

        report += "\n## ⚙️ Configuration Files\n\n"

        for config_file, config_data in self.analysis['configuration_files'].items():
            report += f"### {config_file}\n"
            report += f"**Description**: {config_data.get('description', 'N/A')}\n"

            if 'environment_variables' in config_data:
                configured_vars = sum(1 for var_data in config_data['environment_variables'].values()
                                    if var_data['has_value'] and not var_data['is_placeholder'])
                total_vars = len(config_data['environment_variables'])
                report += f"**Environment Variables**: {configured_vars}/{total_vars} configured\n"

            if 'python_dependencies' in config_data:
                report += f"**Python Dependencies**: {len(config_data['python_dependencies'])}\n"

            if 'package_info' in config_data:
                pkg_info = config_data['package_info']
                report += f"**Package**: {pkg_info.get('name')} v{pkg_info.get('version')}\n"
                report += f"**Dependencies**: {pkg_info.get('dependencies_count', 0)} + {pkg_info.get('dev_dependencies_count', 0)} dev\n"

            report += "\n"

        return report

    def run_analysis(self):
        """Run the complete source code analysis"""
        print("🔍 Starting comprehensive source code analysis...")
        print("=" * 60)

        try:
            self.analyze_service_files()
            self.analyze_configuration_files()
            self.calculate_statistics()

            print("=" * 60)
            print(f"✅ Source code analysis complete!")
            print(f"📊 Summary:")
            print(f"   - Files analyzed: {self.analysis['total_files_analyzed']}")
            print(f"   - Models found in code: {self.analysis['total_models_found_in_code']}")
            print(f"   - API keys found in code: {self.analysis.get('total_api_keys_found_in_code', 0)}")

            return True

        except Exception as e:
            print(f"❌ Analysis failed: {e}")
            return False

    def save_results(self):
        """Save analysis results to files"""
        # Save JSON analysis
        json_file = '/home/woody/CascadeProjects/podplay-scout-alpha/source_code_analysis.json'
        with open(json_file, 'w') as f:
            json.dump(self.analysis, f, indent=2)
        print(f"💾 JSON analysis saved to: {json_file}")

        # Save markdown report
        markdown_file = '/home/woody/CascadeProjects/podplay-scout-alpha/SOURCE_CODE_ANALYSIS_REPORT.md'
        report = self.generate_source_analysis_report()
        with open(markdown_file, 'w') as f:
            f.write(report)
        print(f"📝 Markdown report saved to: {markdown_file}")

if __name__ == "__main__":
    analyzer = SourceCodeModelAnalyzer()

    if analyzer.run_analysis():
        analyzer.save_results()
        print("\n🎉 Source code analysis completed successfully!")
    else:
        print("\n💥 Source code analysis failed!")
