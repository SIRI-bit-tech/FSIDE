"""
URL configuration for AI Engine app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AIModelViewSet, CodeGenerationViewSet, CodeSuggestionViewSet

router = DefaultRouter()
router.register(r'models', AIModelViewSet)
router.register(r'generate', CodeGenerationViewSet, basename='generate')
router.register(r'suggestions', CodeSuggestionViewSet, basename='suggestions')

urlpatterns = [
    path('', include(router.urls)),
]
