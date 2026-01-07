from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Event, EventAttendance
from .serializers import EventListSerializer, EventDetailSerializer, EventWriteSerializer, EventAttendanceSerializer
from pages.models import ModerationQueue


class PublicEventViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access to approved events"""
    queryset = Event.objects.filter(is_approved=True)
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'event_type']
    search_fields = ['title', 'theme', 'description', 'location']
    ordering_fields = ['event_date', 'created_at']
    ordering = ['event_date']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EventDetailSerializer
        return EventListSerializer


class EventViewSet(viewsets.ModelViewSet):
    """Authenticated access for members to create events"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'member_organization'):
            return Event.objects.filter(created_by=self.request.user.member_organization)
        return Event.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return EventWriteSerializer
        if self.action == 'retrieve':
            return EventDetailSerializer
        return EventListSerializer
    
    def perform_create(self, serializer):
        organization = self.request.user.member_organization
        
        # Check if member is verified for auto-approval
        if organization.auto_approve_content:
            event = serializer.save(created_by=organization, is_approved=True, status='UPCOMING')
        else:
            event = serializer.save(created_by=organization, is_approved=False, status='UPCOMING')
            # Create moderation queue entry
            ModerationQueue.objects.create(
                content_object=event,
                submitted_by=organization
            )
    
    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        """Register for an event"""
        event = self.get_object()
        
        if event.is_full:
            return Response({'error': 'Event is at capacity'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = EventAttendanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                event=event,
                organization=request.user.member_organization
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventAttendanceViewSet(viewsets.ReadOnlyModelViewSet):
    """View event attendances"""
    serializer_class = EventAttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'member_organization'):
            return EventAttendance.objects.filter(organization=self.request.user.member_organization)
        return EventAttendance.objects.none()
