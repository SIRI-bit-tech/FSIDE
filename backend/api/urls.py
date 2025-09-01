"""
URL configuration for API app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, FileChangeViewSet, APIMappingViewSet,
    TestResultViewSet, PerformanceMetricViewSet, UserPreferencesViewSet
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'file-changes', FileChangeViewSet, basename='filechange')
router.register(r'api-mappings', APIMappingViewSet, basename='apimapping')
router.register(r'test-results', TestResultViewSet, basename='testresult')
router.register(r'performance-metrics', PerformanceMetricViewSet, basename='performancemetric')
router.register(r'user-preferences', UserPreferencesViewSet, basename='userpreferences')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
]
