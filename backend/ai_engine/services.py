"""
AI Engine services for code generation and analysis.
"""
import requests
import json
import logging
from typing import Dict, List, Optional
from django.conf import settings
from .models import AIModel, CodeSuggestion, TrainingData

logger = logging.getLogger(__name__)


class HuggingFaceService:
    """Service for interacting with Hugging Face API."""
    
    def __init__(self):
        self.api_token = settings.HUGGINGFACE_API_TOKEN
        self.api_url = settings.HUGGINGFACE_API_URL
        self.headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json'
        }
    
    def generate_code(self, prompt: str, model_name: str = 'bigcode/starcoder') -> Optional[str]:
        """Generate code using Hugging Face model."""
        try:
            url = f"{self.api_url}/{model_name}"
            payload = {
                'inputs': prompt,
                'parameters': {
                    'max_new_tokens': 200,
                    'temperature': 0.7,
                    'do_sample': True,
                    'top_p': 0.95
                }
            }
            
            response = requests.post(url, headers=self.headers, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                return result[0].get('generated_text', '').replace(prompt, '').strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Error generating code: {str(e)}")
            return None
    
    def complete_code(self, context: str, model_name: str = 'Salesforce/codet5p-2b') -> Optional[str]:
        """Complete code using Hugging Face model."""
        try:
            url = f"{self.api_url}/{model_name}"
            payload = {
                'inputs': context,
                'parameters': {
                    'max_new_tokens': 100,
                    'temperature': 0.3,
                    'do_sample': True
                }
            }
            
            response = requests.post(url, headers=self.headers, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                return result[0].get('generated_text', '').replace(context, '').strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Error completing code: {str(e)}")
            return None
    
    def analyze_code(self, code: str, model_name: str = 'microsoft/codebert-base') -> Dict:
        """Analyze code for issues and suggestions."""
        try:
            # Mock analysis for now - in production, this would use actual AI models
            analysis = {
                'complexity_score': 0.7,
                'maintainability_score': 0.8,
                'security_issues': [],
                'performance_suggestions': [
                    'Consider using React.memo for this component',
                    'Add error boundaries for better error handling'
                ],
                'code_smells': [],
                'suggestions': [
                    {
                        'type': 'optimization',
                        'message': 'Consider extracting this logic into a custom hook',
                        'line': 15,
                        'confidence': 0.85
                    }
                ]
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing code: {str(e)}")
            return {}


class CodeGenerationService:
    """Service for AI-powered code generation."""
    
    def __init__(self):
        self.hf_service = HuggingFaceService()
    
    def generate_react_component(self, description: str, props: Dict = None) -> Optional[str]:
        """Generate React component from description."""
        props_str = ""
        if props:
            props_str = f"Props: {json.dumps(props, indent=2)}"
        
        prompt = f"""
// Generate a React component based on this description:
// {description}
// {props_str}

import React from 'react';

export default function Component("""
        
        generated_code = self.hf_service.generate_code(prompt, 'bigcode/starcoder')
        
        if generated_code:
            # Clean up and format the generated code
            return self._format_react_component(generated_code)
        
        return None
    
    def generate_django_model(self, description: str, fields: List[Dict] = None) -> Optional[str]:
        """Generate Django model from description."""
        fields_str = ""
        if fields:
            fields_str = f"Fields: {json.dumps(fields, indent=2)}"
        
        prompt = f"""
# Generate a Django model based on this description:
# {description}
# {fields_str}

from django.db import models

class Model(models.Model):
    """
        
        generated_code = self.hf_service.generate_code(prompt, 'bigcode/starcoder')
        
        if generated_code:
            return self._format_django_model(generated_code)
        
        return None
    
    def generate_api_endpoint(self, description: str, method: str = 'GET') -> Optional[str]:
        """Generate API endpoint from description."""
        prompt = f"""
# Generate a Django REST API endpoint:
# Description: {description}
# Method: {method}

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

class APIView(viewsets.ModelViewSet):
    """
        
        generated_code = self.hf_service.generate_code(prompt, 'bigcode/starcoder')
        
        if generated_code:
            return self._format_api_endpoint(generated_code)
        
        return None
    
    def _format_react_component(self, code: str) -> str:
        """Format and clean React component code."""
        # Basic formatting - in production, use proper AST parsing
        lines = code.split('\n')
        formatted_lines = []
        
        for line in lines:
            if line.strip() and not line.strip().startswith('//'):
                formatted_lines.append(line)
        
        return '\n'.join(formatted_lines)
    
    def _format_django_model(self, code: str) -> str:
        """Format and clean Django model code."""
        # Basic formatting - in production, use proper AST parsing
        lines = code.split('\n')
        formatted_lines = []
        
        for line in lines:
            if line.strip() and not line.strip().startswith('#'):
                formatted_lines.append(line)
        
        return '\n'.join(formatted_lines)
    
    def _format_api_endpoint(self, code: str) -> str:
        """Format and clean API endpoint code."""
        # Basic formatting - in production, use proper AST parsing
        lines = code.split('\n')
        formatted_lines = []
        
        for line in lines:
            if line.strip() and not line.strip().startswith('#'):
                formatted_lines.append(line)
        
        return '\n'.join(formatted_lines)


class CodeAnalysisService:
    """Service for AI-powered code analysis."""
    
    def __init__(self):
        self.hf_service = HuggingFaceService()
    
    def analyze_file(self, file_content: str, file_type: str) -> Dict:
        """Analyze a file for issues and suggestions."""
        analysis = self.hf_service.analyze_code(file_content)
        
        # Add file-specific analysis
        if file_type == 'typescript':
            analysis.update(self._analyze_typescript(file_content))
        elif file_type == 'python':
            analysis.update(self._analyze_python(file_content))
        
        return analysis
    
    def _analyze_typescript(self, code: str) -> Dict:
        """Analyze TypeScript/React code."""
        suggestions = []
        
        # Basic pattern matching - in production, use AST parsing
        if 'useState' in code and 'useEffect' not in code:
            suggestions.append({
                'type': 'suggestion',
                'message': 'Consider adding useEffect for side effects',
                'confidence': 0.7
            })
        
        if 'any' in code:
            suggestions.append({
                'type': 'warning',
                'message': 'Avoid using "any" type, use specific types instead',
                'confidence': 0.9
            })
        
        return {'typescript_suggestions': suggestions}
    
    def _analyze_python(self, code: str) -> Dict:
        """Analyze Python/Django code."""
        suggestions = []
        
        # Basic pattern matching - in production, use AST parsing
        if 'models.Model' in code and '__str__' not in code:
            suggestions.append({
                'type': 'suggestion',
                'message': 'Add __str__ method to model for better representation',
                'confidence': 0.8
            })
        
        if 'objects.get(' in code and 'try:' not in code:
            suggestions.append({
                'type': 'warning',
                'message': 'Consider using get_object_or_404 or try/except for .get() calls',
                'confidence': 0.9
            })
        
        return {'python_suggestions': suggestions}
