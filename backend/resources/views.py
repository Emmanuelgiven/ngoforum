from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Resource, ResourceCategory, FAQ, FAQCategory
from .serializers import (
    ResourceSerializer, ResourceWriteSerializer, ResourceCategorySerializer,
    FAQSerializer, FAQCategorySerializer
)
from pages.models import ModerationQueue


class ResourceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Public access to resource categories"""
    queryset = ResourceCategory.objects.all()
    serializer_class = ResourceCategorySerializer
    permission_classes = [permissions.AllowAny]


class PublicResourceViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access to approved resources"""
    queryset = Resource.objects.filter(is_approved=True)
    serializer_class = ResourceSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'resource_type', 'is_featured']
    search_fields = ['title', 'description']
    ordering_fields = ['published_date', 'download_count', 'title']
    ordering = ['-is_featured', '-published_date']
    
    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        """Track downloads"""
        resource = self.get_object()
        resource.increment_download_count()
        return Response({'message': 'Download tracked'})


class ResourceViewSet(viewsets.ModelViewSet):
    """Authenticated access for members to upload resources"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'member_organization'):
            return Resource.objects.filter(uploaded_by=self.request.user.member_organization)
        return Resource.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return ResourceWriteSerializer
        return ResourceSerializer
    
    def perform_create(self, serializer):
        organization = self.request.user.member_organization
        
        # Check if member is verified for auto-approval
        if organization.auto_approve_content:
            resource = serializer.save(uploaded_by=organization, is_approved=True)
        else:
            resource = serializer.save(uploaded_by=organization, is_approved=False)
            # Create moderation queue entry
            ModerationQueue.objects.create(
                content_object=resource,
                submitted_by=organization
            )


class FAQCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Public access to FAQ categories"""
    queryset = FAQCategory.objects.all()
    serializer_class = FAQCategorySerializer
    permission_classes = [permissions.AllowAny]


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access to FAQs"""
    queryset = FAQ.objects.filter(is_published=True)
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['question', 'answer']
