from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import ForumCategory, ForumPost, ForumComment
from .serializers import (
    ForumCategorySerializer, ForumPostListSerializer,
    ForumPostDetailSerializer, ForumPostWriteSerializer, ForumCommentSerializer
)
from pages.models import ModerationQueue


class ForumCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Public access to forum categories"""
    queryset = ForumCategory.objects.all()
    serializer_class = ForumCategorySerializer
    permission_classes = [permissions.AllowAny]


class PublicForumPostViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access to approved forum posts"""
    queryset = ForumPost.objects.filter(status='APPROVED')
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_pinned']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'view_count']
    ordering = ['-is_pinned', '-created_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ForumPostDetailSerializer
        return ForumPostListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.increment_view_count()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ForumPostViewSet(viewsets.ModelViewSet):
    """Authenticated access for members to create forum posts"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'member_organization'):
            return ForumPost.objects.filter(author=self.request.user.member_organization)
        return ForumPost.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return ForumPostWriteSerializer
        if self.action == 'retrieve':
            return ForumPostDetailSerializer
        return ForumPostListSerializer
    
    def perform_create(self, serializer):
        organization = self.request.user.member_organization
        
        # Verified members get auto-approved posts
        if organization.auto_approve_content:
            post = serializer.save(author=organization, status='APPROVED')
        else:
            post = serializer.save(author=organization, status='PENDING')
            # Create moderation queue entry
            ModerationQueue.objects.create(
                content_object=post,
                submitted_by=organization
            )
    
    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        """Add a comment to a post"""
        post = self.get_object()
        
        if post.is_locked:
            return Response({'error': 'This post is locked'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ForumCommentSerializer(data=request.data)
        if serializer.is_valid():
            organization = request.user.member_organization
            
            # Auto-approve comments from verified members
            if organization.auto_approve_content:
                comment = serializer.save(post=post, author=organization, status='APPROVED')
            else:
                comment = serializer.save(post=post, author=organization, status='PENDING')
                ModerationQueue.objects.create(
                    content_object=comment,
                    submitted_by=organization
                )
            
            return Response(ForumCommentSerializer(comment).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForumCommentViewSet(viewsets.ModelViewSet):
    """Manage forum comments"""
    serializer_class = ForumCommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'member_organization'):
            return ForumComment.objects.filter(author=self.request.user.member_organization)
        return ForumComment.objects.none()
