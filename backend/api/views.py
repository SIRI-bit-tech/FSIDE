"""
API views for FSIDE Pro.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Project, FileChange, APIMapping, TestResult, PerformanceMetric, UserPreferences
from .serializers import (
    ProjectSerializer, FileChangeSerializer, APIMappingSerializer,
    TestResultSerializer, PerformanceMetricSerializer, UserPreferencesSerializer,
    UserSerializer
)


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for Project model."""
    
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(
            models.Q(created_by=self.request.user) |
            models.Q(team_members=self.request.user)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def structure(self, request, pk=None):
        """Get complete project structure and dependencies."""
        project = self.get_object()
        
        # Get recent file changes
        recent_changes = FileChange.objects.filter(
            project=project
        ).order_by('-timestamp')[:50]
        
        # Get API mappings
        api_mappings = APIMapping.objects.filter(project=project)
        
        # Get performance metrics
        performance_metrics = PerformanceMetric.objects.filter(
            project=project
        ).order_by('-timestamp')[:20]
        
        return Response({
            'project': ProjectSerializer(project).data,
            'recent_changes': FileChangeSerializer(recent_changes, many=True).data,
            'api_mappings': APIMappingSerializer(api_mappings, many=True).data,
            'performance_metrics': PerformanceMetricSerializer(performance_metrics, many=True).data,
        })
    
    @action(detail=True, methods=['post'])
    def add_team_member(self, request, pk=None):
        """Add a team member to the project."""
        project = self.get_object()
        username = request.data.get('username')
        
        if not username:
            return Response(
                {'error': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(username=username)
            project.team_members.add(user)
            return Response({'message': f'Added {username} to project'})
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class FileChangeViewSet(viewsets.ModelViewSet):
    """ViewSet for FileChange model."""
    
    serializer_class = FileChangeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        queryset = FileChange.objects.all()
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        # Filter by user's accessible projects
        user_projects = Project.objects.filter(
            models.Q(created_by=self.request.user) |
            models.Q(team_members=self.request.user)
        ).values_list('id', flat=True)
        
        return queryset.filter(project_id__in=user_projects)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class APIMappingViewSet(viewsets.ModelViewSet):
    """ViewSet for APIMapping model."""
    
    serializer_class = APIMappingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        queryset = APIMapping.objects.all()
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        # Filter by user's accessible projects
        user_projects = Project.objects.filter(
            models.Q(created_by=self.request.user) |
            models.Q(team_members=self.request.user)
        ).values_list('id', flat=True)
        
        return queryset.filter(project_id__in=user_projects)
    
    @action(detail=False, methods=['post'])
    def analyze(self, request):
        """Analyze and map API relationships."""
        project_id = request.data.get('project_id')
        
        if not project_id:
            return Response(
                {'error': 'Project ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        project = get_object_or_404(Project, id=project_id)
        
        # Mock analysis - in production, this would use AI to analyze code
        mock_mappings = [
            {
                'frontend_component': 'UserProfile',
                'backend_endpoint': '/api/users/{id}/',
                'relationship_type': 'crud',
                'method': 'GET',
                'parameters': {'id': 'integer'},
                'response_schema': {'user': 'object'}
            },
            {
                'frontend_component': 'ProjectList',
                'backend_endpoint': '/api/projects/',
                'relationship_type': 'read_only',
                'method': 'GET',
                'parameters': {},
                'response_schema': {'projects': 'array'}
            }
        ]
        
        return Response({
            'mappings': mock_mappings,
            'analysis_complete': True
        })
    
    @action(detail=False, methods=['get'])
    def visualize(self, request):
        """Get 3D visualization data for API relationships."""
        project_id = request.query_params.get('project_id')
        
        if not project_id:
            return Response(
                {'error': 'Project ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        mappings = self.get_queryset().filter(project_id=project_id)
        
        # Generate 3D visualization data
        nodes = []
        edges = []
        
        for mapping in mappings:
            # Frontend component node
            frontend_node = {
                'id': f"frontend_{mapping.frontend_component}",
                'label': mapping.frontend_component,
                'type': 'frontend',
                'position': {'x': 0, 'y': 0, 'z': 0}  # Will be calculated by frontend
            }
            
            # Backend endpoint node
            backend_node = {
                'id': f"backend_{mapping.backend_endpoint}",
                'label': mapping.backend_endpoint,
                'type': 'backend',
                'position': {'x': 100, 'y': 0, 'z': 0}  # Will be calculated by frontend
            }
            
            # Connection edge
            edge = {
                'source': frontend_node['id'],
                'target': backend_node['id'],
                'type': mapping.relationship_type,
                'method': mapping.method
            }
            
            nodes.extend([frontend_node, backend_node])
            edges.append(edge)
        
        return Response({
            'nodes': nodes,
            'edges': edges,
            'metadata': {
                'total_mappings': len(mappings),
                'project_id': project_id
            }
        })


class TestResultViewSet(viewsets.ModelViewSet):
    """ViewSet for TestResult model."""
    
    serializer_class = TestResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        queryset = TestResult.objects.all()
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        # Filter by user's accessible projects
        user_projects = Project.objects.filter(
            models.Q(created_by=self.request.user) |
            models.Q(team_members=self.request.user)
        ).values_list('id', flat=True)
        
        return queryset.filter(project_id__in=user_projects)


class PerformanceMetricViewSet(viewsets.ModelViewSet):
    """ViewSet for PerformanceMetric model."""
    
    serializer_class = PerformanceMetricSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        queryset = PerformanceMetric.objects.all()
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        # Filter by user's accessible projects
        user_projects = Project.objects.filter(
            models.Q(created_by=self.request.user) |
            models.Q(team_members=self.request.user)
        ).values_list('id', flat=True)
        
        return queryset.filter(project_id__in=user_projects)
    
    @action(detail=False, methods=['get'])
    def analyze(self, request):
        """Get performance analysis and suggestions."""
        project_id = request.query_params.get('project_id')
        
        if not project_id:
            return Response(
                {'error': 'Project ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        metrics = self.get_queryset().filter(project_id=project_id)
        
        # Calculate performance statistics
        avg_response_time = metrics.aggregate(
            avg_time=models.Avg('response_time')
        )['avg_time'] or 0
        
        slow_endpoints = metrics.filter(
            response_time__gt=1000
        ).values('endpoint').distinct()
        
        suggestions = []
        if avg_response_time > 500:
            suggestions.append({
                'type': 'performance',
                'message': 'Consider implementing caching for better response times',
                'priority': 'high'
            })
        
        if slow_endpoints.exists():
            suggestions.append({
                'type': 'optimization',
                'message': f'Optimize slow endpoints: {list(slow_endpoints)}',
                'priority': 'medium'
            })
        
        return Response({
            'average_response_time': avg_response_time,
            'slow_endpoints': list(slow_endpoints),
            'suggestions': suggestions,
            'total_requests': metrics.count()
        })


class UserPreferencesViewSet(viewsets.ModelViewSet):
    """ViewSet for UserPreferences model."""
    
    serializer_class = UserPreferencesSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserPreferences.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
