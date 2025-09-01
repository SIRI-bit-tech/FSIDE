"""
WebSocket consumers for real-time collaboration.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from api.models import Project
from .models import CollaborationSession, RealtimeEdit


class CollaborationConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time collaboration."""
    
    async def connect(self):
        self.project_id = self.scope['url_route']['kwargs']['project_id']
        self.room_group_name = f'collaboration_{self.project_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Add user to collaboration session
        await self.add_user_to_session()
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        # Remove user from collaboration session
        await self.remove_user_from_session()
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'edit_operation':
            await self.handle_edit_operation(data)
        elif message_type == 'cursor_position':
            await self.handle_cursor_position(data)
        elif message_type == 'file_change':
            await self.handle_file_change(data)
    
    async def handle_edit_operation(self, data):
        """Handle real-time edit operations."""
        # Save edit to database
        await self.save_edit_operation(data)
        
        # Broadcast to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'edit_operation',
                'data': data,
                'user': self.scope['user'].username
            }
        )
    
    async def handle_cursor_position(self, data):
        """Handle cursor position updates."""
        # Broadcast cursor position to other users
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'cursor_position',
                'data': data,
                'user': self.scope['user'].username
            }
        )
    
    async def handle_file_change(self, data):
        """Handle file change notifications."""
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'file_change',
                'data': data,
                'user': self.scope['user'].username
            }
        )
    
    async def edit_operation(self, event):
        """Send edit operation to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'edit_operation',
            'data': event['data'],
            'user': event['user']
        }))
    
    async def cursor_position(self, event):
        """Send cursor position to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'cursor_position',
            'data': event['data'],
            'user': event['user']
        }))
    
    async def file_change(self, event):
        """Send file change notification to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'file_change',
            'data': event['data'],
            'user': event['user']
        }))
    
    @database_sync_to_async
    def add_user_to_session(self):
        """Add user to collaboration session."""
        try:
            project = Project.objects.get(id=self.project_id)
            session, created = CollaborationSession.objects.get_or_create(
                project=project,
                is_active=True,
                defaults={'session_data': {}}
            )
            session.participants.add(self.scope['user'])
            return session
        except Project.DoesNotExist:
            return None
    
    @database_sync_to_async
    def remove_user_from_session(self):
        """Remove user from collaboration session."""
        try:
            project = Project.objects.get(id=self.project_id)
            session = CollaborationSession.objects.get(
                project=project,
                is_active=True
            )
            session.participants.remove(self.scope['user'])
            
            # Close session if no participants
            if session.participants.count() == 0:
                session.is_active = False
                session.save()
                
        except (Project.DoesNotExist, CollaborationSession.DoesNotExist):
            pass
    
    @database_sync_to_async
    def save_edit_operation(self, data):
        """Save edit operation to database."""
        try:
            project = Project.objects.get(id=self.project_id)
            session = CollaborationSession.objects.get(
                project=project,
                is_active=True
            )
            
            RealtimeEdit.objects.create(
                session=session,
                user=self.scope['user'],
                file_path=data.get('file_path', ''),
                operation_type=data.get('operation_type', 'insert'),
                position=data.get('position', {}),
                content=data.get('content', '')
            )
        except (Project.DoesNotExist, CollaborationSession.DoesNotExist):
            pass


class AISuggestionsConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for live AI suggestions."""
    
    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f'ai_suggestions_{self.session_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'request_suggestions':
            await self.handle_suggestion_request(data)
    
    async def handle_suggestion_request(self, data):
        """Handle AI suggestion requests."""
        # Mock AI suggestions - in production, integrate with AI service
        suggestions = [
            {
                'type': 'completion',
                'text': 'const [state, setState] = useState()',
                'confidence': 0.9,
                'position': data.get('position', {})
            },
            {
                'type': 'suggestion',
                'text': 'Add error handling',
                'confidence': 0.8,
                'description': 'Consider adding try-catch block'
            }
        ]
        
        # Send suggestions back
        await self.send(text_data=json.dumps({
            'type': 'ai_suggestions',
            'suggestions': suggestions,
            'context': data.get('context', '')
        }))
