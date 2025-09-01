"""
Serializers for API models.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, FileChange, APIMapping, TestResult, PerformanceMetric, UserPreferences


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for Project model."""
    
    created_by = UserSerializer(read_only=True)
    team_members = UserSerializer(many=True, read_only=True)
    file_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'project_type', 'created_by',
            'team_members', 'configuration', 'ai_settings', 'created_at',
            'updated_at', 'is_active', 'file_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_file_count(self, obj):
        return obj.file_changes.filter(change_type__in=['create', 'update']).count()


class FileChangeSerializer(serializers.ModelSerializer):
    """Serializer for FileChange model."""
    
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = FileChange
        fields = [
            'id', 'project', 'file_path', 'change_type', 'content_diff',
            'author', 'timestamp', 'commit_hash'
        ]
        read_only_fields = ['id', 'timestamp']


class APIMappingSerializer(serializers.ModelSerializer):
    """Serializer for APIMapping model."""
    
    class Meta:
        model = APIMapping
        fields = [
            'id', 'project', 'frontend_component', 'backend_endpoint',
            'relationship_type', 'method', 'parameters', 'response_schema',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TestResultSerializer(serializers.ModelSerializer):
    """Serializer for TestResult model."""
    
    class Meta:
        model = TestResult
        fields = [
            'id', 'project', 'test_suite', 'test_name', 'status',
            'results', 'coverage_data', 'execution_time', 'error_message',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class PerformanceMetricSerializer(serializers.ModelSerializer):
    """Serializer for PerformanceMetric model."""
    
    class Meta:
        model = PerformanceMetric
        fields = [
            'id', 'project', 'endpoint', 'response_time', 'memory_usage',
            'cpu_usage', 'request_count', 'error_count', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']


class UserPreferencesSerializer(serializers.ModelSerializer):
    """Serializer for UserPreferences model."""
    
    class Meta:
        model = UserPreferences
        fields = [
            'user', 'theme_settings', 'keyboard_shortcuts', 'ai_preferences',
            'notification_settings', 'editor_settings', 'preferred_theme',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
