"""
Serializers for AI Engine models.
"""
from rest_framework import serializers
from .models import AIModel, CodeSuggestion, TrainingData


class AIModelSerializer(serializers.ModelSerializer):
    """Serializer for AIModel."""
    
    class Meta:
        model = AIModel
        fields = [
            'id', 'name', 'model_type', 'huggingface_model_id',
            'configuration', 'training_data', 'performance_metrics',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CodeSuggestionSerializer(serializers.ModelSerializer):
    """Serializer for CodeSuggestion."""
    
    class Meta:
        model = CodeSuggestion
        fields = [
            'id', 'project', 'user', 'ai_model', 'suggestion_type',
            'context', 'suggestion', 'confidence_score', 'acceptance_rate',
            'feedback', 'is_accepted', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']


class TrainingDataSerializer(serializers.ModelSerializer):
    """Serializer for TrainingData."""
    
    class Meta:
        model = TrainingData
        fields = [
            'id', 'data_type', 'content', 'language', 'tags',
            'quality_score', 'usage_count', 'created_at'
        ]
        read_only_fields = ['id', 'usage_count', 'created_at']
