"""
Views for collaboration features.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from api.models import Project
from .models import CollaborationSession


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def collaboration_sessions(request):
    """Get active collaboration sessions for user."""
    sessions = CollaborationSession.objects.filter(
        participants=request.user,
        is_active=True
    )
    
    session_data = []
    for session in sessions:
        session_data.append({
            'id': session.id,
            'project': {
                'id': session.project.id,
                'name': session.project.name
            },
            'participants': [
                {'username': user.username, 'id': user.id}
                for user in session.participants.all()
            ],
            'active_file': session.active_file,
            'created_at': session.created_at
        })
    
    return Response({'sessions': session_data})


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_session(request, project_id):
    """Get or create collaboration session for project."""
    project = get_object_or_404(Project, id=project_id)
    
    # Check if user has access to project
    if not (project.created_by == request.user or request.user in project.team_members.all()):
        return Response(
            {'error': 'Access denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'GET':
        try:
            session = CollaborationSession.objects.get(
                project=project,
                is_active=True
            )
        except CollaborationSession.DoesNotExist:
            return Response({'session': None})
        
        return Response({
            'session': {
                'id': session.id,
                'project': {
                    'id': session.project.id,
                    'name': session.project.name
                },
                'participants': [
                    {'username': user.username, 'id': user.id}
                    for user in session.participants.all()
                ],
                'active_file': session.active_file,
                'created_at': session.created_at
            }
        })
    
    elif request.method == 'POST':
        session, created = CollaborationSession.objects.get_or_create(
            project=project,
            is_active=True,
            defaults={'session_data': {}}
        )
        
        session.participants.add(request.user)
        
        return Response({
            'session': {
                'id': session.id,
                'project': {
                    'id': session.project.id,
                    'name': session.project.name
                },
                'participants': [
                    {'username': user.username, 'id': user.id}
                    for user in session.participants.all()
                ],
                'active_file': session.active_file,
                'created_at': session.created_at
            },
            'created': created
        })
