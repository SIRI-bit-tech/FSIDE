"""
Collaboration models for real-time features.
"""
from django.db import models
from django.contrib.auth.models import User
from api.models import Project
import uuid


class CollaborationSession(models.Model):
    """Real-time collaboration session."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='collaboration_sessions')
    participants = models.ManyToManyField(User, related_name='collaboration_sessions')
    active_file = models.CharField(max_length=500, blank=True)
    session_data = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Session for {self.project.name}"


class RealtimeEdit(models.Model):
    """Real-time edit operations."""
    
    OPERATION_TYPES = [
        ('insert', 'Insert'),
        ('delete', 'Delete'),
        ('replace', 'Replace'),
        ('cursor', 'Cursor Move'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(CollaborationSession, on_delete=models.CASCADE, related_name='edits')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_path = models.CharField(max_length=500)
    operation_type = models.CharField(max_length=10, choices=OPERATION_TYPES)
    position = models.JSONField(default=dict)  # {line, column}
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.operation_type} by {self.user.username}"
