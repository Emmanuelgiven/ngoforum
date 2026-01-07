from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
import csv
from .models import State, County, Sector, OperationalPresence
from .serializers import (
    StateSerializer, CountySerializer, SectorSerializer,
    OperationalPresenceSerializer, OperationalPresenceWriteSerializer
)


class StateViewSet(viewsets.ReadOnlyModelViewSet):
    """Public access to states"""
    queryset = State.objects.all()
    serializer_class = StateSerializer
    permission_classes = [permissions.AllowAny]


class CountyViewSet(viewsets.ReadOnlyModelViewSet):
    """Public access to counties"""
    queryset = County.objects.all()
    serializer_class = CountySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['state']


class SectorViewSet(viewsets.ReadOnlyModelViewSet):
    """Public access to sectors"""
    queryset = Sector.objects.all()
    serializer_class = SectorSerializer
    permission_classes = [permissions.AllowAny]


class PublicOperationalPresenceViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access to 3W data"""
    queryset = OperationalPresence.objects.filter(is_active=True)
    serializer_class = OperationalPresenceSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['organization__member_type', 'sector', 'county', 'county__state', 'year']
    ordering_fields = ['year', 'organization__name']
    ordering = ['-year']
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """Export 3W data to CSV"""
        queryset = self.filter_queryset(self.get_queryset())
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="3w_data.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Organization', 'Type', 'Sector', 'County', 'State', 'Year', 'Presence Count'])
        
        for record in queryset:
            writer.writerow([
                record.organization.name,
                record.organization.member_type,
                record.sector.name,
                record.county.name,
                record.county.state.name,
                record.year,
                record.presence_count
            ])
        
        return response


class OperationalPresenceViewSet(viewsets.ModelViewSet):
    """Authenticated access for members to manage their 3W data"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'member_organization'):
            return OperationalPresence.objects.filter(organization=self.request.user.member_organization)
        return OperationalPresence.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return OperationalPresenceWriteSerializer
        return OperationalPresenceSerializer
    
    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.member_organization)
