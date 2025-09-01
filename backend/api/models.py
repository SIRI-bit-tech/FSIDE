"""
Core API models for FSIDE Pro.
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid


class Project(models.Model):
    """Project model for storing user projects."""
    
    PROJECT_TYPES = [
        ('react', 'React Frontend'),
        ('django', 'Django Backend'),
        ('fullstack', 'Full Stack'),
        ('component', 'Component Library'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPES, default='fullstack')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    team_members = models.ManyToManyField(User, blank=True, related_name='shared_projects')
    configuration = models.JSONField(default=dict)
    ai_settings = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.name} ({self.project_type})"


class FileChange(models.Model):
    """Track file changes in projects."""
    
    CHANGE_TYPES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('rename', 'Rename'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='file_changes')
    file_path = models.CharField(max_length=500)
    change_type = models.CharField(max_length=10, choices=CHANGE_TYPES)
    content_diff = models.TextField(blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    commit_hash = models.CharField(max_length=40, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.change_type}: {self.file_path}"


class APIMapping(models.Model):
    """Map frontend components to backend endpoints."""
    
    RELATIONSHIP_TYPES = [
        ('crud', 'CRUD Operations'),
        ('read_only', 'Read Only'),
        ('write_only', 'Write Only'),
        ('websocket', 'WebSocket Connection'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='api_mappings')
    frontend_component = models.CharField(max_length=200)
    backend_endpoint = models.CharField(max_length=200)
    relationship_type = models.CharField(max_length=20, choices=RELATIONSHIP_TYPES)
    method = models.CharField(max_length=10, default='GET')
    parameters = models.JSONField(default=dict)
    response_schema = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['project', 'frontend_component', 'backend_endpoint']
    
    def __str__(self):
        return f"{self.frontend_component} -> {self.backend_endpoint}"


class TestResult(models.Model):
    """Store test execution results."""
    
    TEST_STATUSES = [
        ('passed', 'Passed'),
        ('failed', 'Failed'),
        ('skipped', 'Skipped'),
        ('error', 'Error'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='test_results')
    test_suite = models.CharField(max_length=200)
    test_name = models.CharField(max_length=200)
    status = models.CharField(max_length=10, choices=TEST_STATUSES)
    results = models.JSONField(default=dict)
    coverage_data = models.JSONField(default=dict)
    execution_time = models.FloatField(default=0.0)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.test_suite}: {self.test_name} ({self.status})"


class PerformanceMetric(models.Model):
    """Store performance metrics for projects."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='performance_metrics')
    endpoint = models.CharField(max_length=200)
    response_time = models.FloatField()
    memory_usage = models.FloatField()
    cpu_usage = models.FloatField(default=0.0)
    request_count = models.IntegerField(default=1)
    error_count = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.endpoint}: {self.response_time}ms"


class UserPreferences(models.Model):
    """Store user preferences and settings."""
    
    THEMES = [
        ('dark', 'Dark Theme'),
        ('light', 'Light Theme'),
        ('auto', 'Auto Theme'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    theme_settings = models.JSONField(default=dict)
    keyboard_shortcuts = models.JSONField(default=dict)
    ai_preferences = models.JSONField(default=dict)
    notification_settings = models.JSONField(default=dict)
    editor_settings = models.JSONField(default=dict)
    preferred_theme = models.CharField(max_length=10, choices=THEMES, default='dark')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} preferences"


class AIModel(models.Model):
    """AI model configurations and performance tracking."""
    
    MODEL_TYPES = [
        ('code_generation', 'Code Generation'),
        ('code_analysis', 'Code Analysis'),
        ('testing', 'Test Generation'),
        ('refactoring', 'Code Refactoring'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    model_type = models.CharField(max_length=20, choices=MODEL_TYPES)
    huggingface_model_id = models.CharField(max_length=200)
    configuration = models.JSONField(default=dict)
    training_data = models.JSONField(default=dict)
    performance_metrics = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.model_type})"


class CodeSuggestion(models.Model):
    """Store AI code suggestions and user feedback."""
    
    SUGGESTION_TYPES = [
        ('completion', 'Code Completion'),
        ('refactor', 'Refactoring'),
        ('fix', 'Bug Fix'),
        ('optimize', 'Optimization'),
        ('test', 'Test Generation'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='api_code_suggestions')
    file_path = models.CharField(max_length=500)
    context = models.TextField()
    suggestion = models.TextField()
    suggestion_type = models.CharField(max_length=20, choices=SUGGESTION_TYPES)
    model_used = models.ForeignKey(AIModel, on_delete=models.CASCADE)
    confidence_score = models.FloatField(default=0.0)
    acceptance_rate = models.FloatField(default=0.0)
    user_feedback = models.JSONField(default=dict)
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.suggestion_type}: {self.file_path[:50]}..."


class GitRepository(models.Model):
    """Git repository integration for projects."""
    
    PROVIDERS = [
        ('github', 'GitHub'),
        ('gitlab', 'GitLab'),
        ('bitbucket', 'Bitbucket'),
        ('local', 'Local Repository'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='git_repository')
    provider = models.CharField(max_length=20, choices=PROVIDERS)
    repository_url = models.URLField()
    branch = models.CharField(max_length=100, default='main')
    access_token = models.CharField(max_length=500, blank=True)
    webhook_secret = models.CharField(max_length=100, blank=True)
    last_sync = models.DateTimeField(null=True, blank=True)
    sync_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.project.name} - {self.provider}"


class SecurityVulnerability(models.Model):
    """Track security vulnerabilities in projects."""
    
    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('fixed', 'Fixed'),
        ('ignored', 'Ignored'),
        ('false_positive', 'False Positive'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='vulnerabilities')
    file_path = models.CharField(max_length=500)
    vulnerability_type = models.CharField(max_length=100)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS)
    description = models.TextField()
    recommendation = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    detected_at = models.DateTimeField(auto_now_add=True)
    fixed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-detected_at']
    
    def __str__(self):
        return f"{self.vulnerability_type} - {self.severity}"
