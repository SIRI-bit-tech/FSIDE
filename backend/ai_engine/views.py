"""
AI Engine API views.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from api.models import Project
from .models import AIModel, CodeSuggestion
from .services import CodeGenerationService, CodeAnalysisService
from .serializers import AIModelSerializer, CodeSuggestionSerializer


class AIModelViewSet(viewsets.ModelViewSet):
    """ViewSet for AI models."""
    
    queryset = AIModel.objects.filter(is_active=True)
    serializer_class = AIModelSerializer
    permission_classes = [IsAuthenticated]


class CodeGenerationViewSet(viewsets.ViewSet):
    """ViewSet for AI code generation."""
    
    permission_classes = [IsAuthenticated]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.generation_service = CodeGenerationService()
    
    @action(detail=False, methods=['post'])
    def generate_model(self, request):
        """Generate Django model from schema description."""
        description = request.data.get('description')
        fields = request.data.get('fields', [])
        project_id = request.data.get('project_id')
        
        if not description:
            return Response(
                {'error': 'Description is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            generated_code = self.generation_service.generate_django_model(description, fields)
            
            if generated_code:
                # Save suggestion to database
                if project_id:
                    project = get_object_or_404(Project, id=project_id)
                    CodeSuggestion.objects.create(
                        project=project,
                        user=request.user,
                        ai_model=AIModel.objects.filter(model_type='code_generation').first(),
                        suggestion_type='generation',
                        context=description,
                        suggestion=generated_code,
                        confidence_score=0.85
                    )
                
                return Response({
                    'generated_code': generated_code,
                    'language': 'python',
                    'type': 'django_model'
                })
            else:
                return Response(
                    {'error': 'Failed to generate code'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def generate_component(self, request):
        """Generate React component from wireframe/description."""
        description = request.data.get('description')
        props = request.data.get('props', {})
        project_id = request.data.get('project_id')
        
        if not description:
            return Response(
                {'error': 'Description is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            generated_code = self.generation_service.generate_react_component(description, props)
            
            if generated_code:
                # Save suggestion to database
                if project_id:
                    project = get_object_or_404(Project, id=project_id)
                    CodeSuggestion.objects.create(
                        project=project,
                        user=request.user,
                        ai_model=AIModel.objects.filter(model_type='code_generation').first(),
                        suggestion_type='generation',
                        context=description,
                        suggestion=generated_code,
                        confidence_score=0.80
                    )
                
                return Response({
                    'generated_code': generated_code,
                    'language': 'typescript',
                    'type': 'react_component'
                })
            else:
                return Response(
                    {'error': 'Failed to generate code'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CodeSuggestionViewSet(viewsets.ModelViewSet):
    """ViewSet for code suggestions."""
    
    serializer_class = CodeSuggestionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        queryset = CodeSuggestion.objects.filter(user=self.request.user)
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        return queryset.order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """Get contextual code suggestions for a file."""
        file_path = request.query_params.get('file_path')
        project_id = request.query_params.get('project_id')
        
        if not file_path or not project_id:
            return Response(
                {'error': 'file_path and project_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            analysis_service = CodeAnalysisService()
            
            # Mock file content - in production, get from file system
            mock_content = "import React from 'react'\n\nexport default function Component() {\n  return <div>Hello</div>\n}"
            
            analysis = analysis_service.analyze_file(mock_content, 'typescript')
            
            suggestions = [
                {
                    'type': 'suggestion',
                    'title': 'Add PropTypes',
                    'description': 'Consider adding PropTypes for better type checking',
                    'confidence': 85,
                    'line': 3
                },
                {
                    'type': 'optimization',
                    'title': 'Use React.memo',
                    'description': 'Wrap component with React.memo to prevent unnecessary re-renders',
                    'confidence': 75,
                    'line': 3
                }
            ]
            
            return Response({
                'suggestions': suggestions,
                'analysis': analysis,
                'file_path': file_path
            })
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
