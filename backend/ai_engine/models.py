"""
AI Engine models for FSIDE Pro.
"""
from django.db import models
from django.contrib.auth.models import User
from api.models import Project
import uuid


class AIModel(models.Model):
    """AI Model configuration."""
    
    MODEL_TYPES = [
        ('code_generation', 'Code Generation'),
        ('code_completion', 'Code Completion'),
        ('code_analysis', 'Code Analysis'),
        ('text_generation', 'Text Generation'),
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
    """Store AI code suggestions."""
    
    SUGGESTION_TYPES = [
        ('completion', 'Code Completion'),
        ('generation', 'Code Generation'),
        ('refactor', 'Code Refactoring'),
        ('fix', 'Bug Fix'),
        ('optimization', 'Performance Optimization'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='ai_code_suggestions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ai_model = models.ForeignKey(AIModel, on_delete=models.CASCADE)
    suggestion_type = models.CharField(max_length=20, choices=SUGGESTION_TYPES)
    context = models.TextField()
    suggestion = models.TextField()
    confidence_score = models.FloatField(default=0.0)
    acceptance_rate = models.FloatField(default=0.0)
    feedback = models.JSONField(default=dict)
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.suggestion_type} suggestion for {self.project.name}"


class TrainingData(models.Model):
    """Store training data for AI models."""
    
    DATA_TYPES = [
        ('code_snippet', 'Code Snippet'),
        ('component', 'React Component'),
        ('model', 'Django Model'),
        ('api_endpoint', 'API Endpoint'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    data_type = models.CharField(max_length=20, choices=DATA_TYPES)
    content = models.TextField()
    language = models.CharField(max_length=50)
    tags = models.JSONField(default=list)
    quality_score = models.FloatField(default=0.0)
    usage_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-quality_score', '-created_at']
    
    def __str__(self):
        return f"{self.data_type} - {self.language}"
