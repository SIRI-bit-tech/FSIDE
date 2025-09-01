"""
URL configuration for collaboration app.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('sessions/', views.collaboration_sessions, name='collaboration_sessions'),
    path('sessions/<uuid:project_id>/', views.get_session, name='get_session'),
]
