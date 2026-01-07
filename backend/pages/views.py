from rest_framework import viewsets, permissions, filters, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Page, ContactMessage, ModerationQueue, Announcement
from .serializers import PageSerializer, ContactMessageSerializer, ModerationQueueSerializer, AnnouncementSerializer


class PageViewSet(viewsets.ReadOnlyModelViewSet):
    """Public access to static pages"""
    queryset = Page.objects.filter(is_published=True)
    serializer_class = PageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ContactMessageViewSet(generics.CreateAPIView):
    """Submit contact messages"""
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        serializer.save(status='NEW')


class ModerationQueueViewSet(viewsets.ReadOnlyModelViewSet):
    """Staff access to moderation queue"""
    serializer_class = ModerationQueueSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['moderation_status', 'content_type']
    ordering = ['created_at']
    
    def get_queryset(self):
        return ModerationQueue.objects.all()
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve content"""
        item = self.get_object()
        notes = request.data.get('notes', '')
        item.approve(request.user, notes)
        return Response({'message': 'Content approved'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject content"""
        item = self.get_object()
        notes = request.data.get('notes', 'Content does not meet standards')
        item.reject(request.user, notes)
        return Response({'message': 'Content rejected'})


class AnnouncementViewSet(viewsets.ReadOnlyModelViewSet):
    """Public access to active announcements"""
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        from django.utils import timezone
        return Announcement.objects.filter(
            is_published=True,
            publish_date__lte=timezone.now()
        ).exclude(
            expiry_date__lt=timezone.now()
        ).order_by('-priority', '-publish_date')
