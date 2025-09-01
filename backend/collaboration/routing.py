"""
WebSocket URL routing for collaboration app.
"""
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/collaboration/(?P<project_id>[^/]+)/$', consumers.CollaborationConsumer.as_asgi()),
    re_path(r'ws/ai-suggestions/(?P<session_id>[^/]+)/$', consumers.AISuggestionsConsumer.as_asgi()),
]
