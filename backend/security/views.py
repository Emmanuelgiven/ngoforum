from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import SecurityIncident, AccessConstraint
from .serializers import (
    SecurityIncidentSerializer, SecurityIncidentWriteSerializer,
    AccessConstraintSerializer, AccessConstraintWriteSerializer
)


class SecurityIncidentViewSet(viewsets.ModelViewSet):
    """Manage security incident reports"""
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['severity', 'status', 'when_date']
    ordering_fields = ['when_date', 'created_at']
    ordering = ['-when_date']
    
    def get_queryset(self):
        if self.request.user.is_staff:
            # Staff can see all incidents
            return SecurityIncident.objects.all()
        elif hasattr(self.request.user, 'member_organization'):
            # Members can only see their own incidents (non-confidential of others)
            return SecurityIncident.objects.filter(
                organization=self.request.user.member_organization
            ) | SecurityIncident.objects.filter(is_confidential=False)
        return SecurityIncident.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return SecurityIncidentWriteSerializer
        return SecurityIncidentSerializer
    
    def perform_create(self, serializer):
        incident = serializer.save(
            organization=self.request.user.member_organization,
            status='REPORTED'
        )
        
        # TODO: Send email alert to staff
        # from pages.emails import send_security_alert_email
        # send_security_alert_email(incident)


class AccessConstraintViewSet(viewsets.ModelViewSet):
    """Manage access constraint reports"""
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['constraint_type', 'status', 'county']
    ordering_fields = ['date_reported', 'created_at']
    ordering = ['-date_reported']
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return AccessConstraint.objects.all()
        elif hasattr(self.request.user, 'member_organization'):
            return AccessConstraint.objects.filter(organization=self.request.user.member_organization)
        return AccessConstraint.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return AccessConstraintWriteSerializer
        return AccessConstraintSerializer
    
    def perform_create(self, serializer):
        serializer.save(
            organization=self.request.user.member_organization,
            status='ACTIVE'
        )
