from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import JobAdvertisement, Training, TenderAdvertisement
from .serializers import (
    JobAdvertisementSerializer, JobAdvertisementWriteSerializer,
    TrainingSerializer, TrainingWriteSerializer,
    TenderAdvertisementSerializer, TenderAdvertisementWriteSerializer
)
from pages.models import ModerationQueue


class PublicJobAdvertisementViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access to approved job ads"""
    queryset = JobAdvertisement.objects.filter(is_approved=True, is_active=True)
    serializer_class = JobAdvertisementSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'location']
    search_fields = ['job_title', 'description', 'location']
    ordering_fields = ['posted_date', 'application_deadline']
    ordering = ['-posted_date']


class JobAdvertisementViewSet(viewsets.ModelViewSet):
    """Authenticated access for members to post jobs"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'member_organization'):
            return JobAdvertisement.objects.filter(organization=self.request.user.member_organization)
        return JobAdvertisement.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return JobAdvertisementWriteSerializer
        return JobAdvertisementSerializer
    
    def perform_create(self, serializer):
        organization = self.request.user.member_organization
        
        if organization.auto_approve_content:
            job = serializer.save(organization=organization, is_approved=True)
        else:
            job = serializer.save(organization=organization, is_approved=False)
            ModerationQueue.objects.create(
                content_object=job,
                submitted_by=organization
            )


class PublicTrainingViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access to approved trainings"""
    queryset = Training.objects.filter(is_approved=True, is_active=True)
    serializer_class = TrainingSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_online', 'is_free']
    search_fields = ['title', 'provider', 'description']
    ordering_fields = ['start_date', 'posted_date']
    ordering = ['start_date']


class TrainingViewSet(viewsets.ModelViewSet):
    """Authenticated access for members to post trainings"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'member_organization'):
            return Training.objects.filter(submitted_by=self.request.user.member_organization)
        return Training.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return TrainingWriteSerializer
        return TrainingSerializer
    
    def perform_create(self, serializer):
        organization = self.request.user.member_organization
        
        if organization.auto_approve_content:
            training = serializer.save(submitted_by=organization, is_approved=True)
        else:
            training = serializer.save(submitted_by=organization, is_approved=False)
            ModerationQueue.objects.create(
                content_object=training,
                submitted_by=organization
            )


class PublicTenderAdvertisementViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access to approved tenders"""
    queryset = TenderAdvertisement.objects.filter(is_approved=True, is_active=True)
    serializer_class = TenderAdvertisementSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'description', 'reference_number']
    ordering_fields = ['submission_deadline', 'posted_date']
    ordering = ['submission_deadline']


class TenderAdvertisementViewSet(viewsets.ModelViewSet):
    """Authenticated access for members to post tenders"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'member_organization'):
            return TenderAdvertisement.objects.filter(organization=self.request.user.member_organization)
        return TenderAdvertisement.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return TenderAdvertisementWriteSerializer
        return TenderAdvertisementSerializer
    
    def perform_create(self, serializer):
        organization = self.request.user.member_organization
        
        if organization.auto_approve_content:
            tender = serializer.save(organization=organization, is_approved=True)
        else:
            tender = serializer.save(organization=organization, is_approved=False)
            ModerationQueue.objects.create(
                content_object=tender,
                submitted_by=organization
            )
