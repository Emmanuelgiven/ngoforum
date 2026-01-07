from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import MemberOrganization, OrganizationContact, StaffMember, MembershipApplication, MembershipPayment
from .serializers import (
    MemberOrganizationListSerializer, MemberOrganizationDetailSerializer,
    MemberOrganizationWriteSerializer, OrganizationContactSerializer,
    StaffMemberSerializer, MembershipApplicationSerializer, MembershipPaymentSerializer
)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners to edit their organization"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user if hasattr(obj, 'user') else False


class PublicMemberViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access to member organizations"""
    queryset = MemberOrganization.objects.filter(status='ACTIVE')
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['member_type', 'state', 'city', 'is_verified']
    search_fields = ['name', 'description', 'state', 'city']
    ordering_fields = ['name', 'date_joined', 'member_type']
    ordering = ['name']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MemberOrganizationDetailSerializer
        return MemberOrganizationListSerializer


class MemberProfileViewSet(viewsets.ModelViewSet):
    """Authenticated member profile management"""
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        # Members can only access their own organization
        if hasattr(self.request.user, 'member_organization'):
            return MemberOrganization.objects.filter(id=self.request.user.member_organization.id)
        return MemberOrganization.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return MemberOrganizationWriteSerializer
        return MemberOrganizationDetailSerializer
    
    @action(detail=True, methods=['post'])
    def add_contact(self, request, pk=None):
        """Add a contact person to the organization"""
        organization = self.get_object()
        serializer = OrganizationContactSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(organization=organization)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StaffMemberViewSet(viewsets.ReadOnlyModelViewSet):
    """Public access to staff directory"""
    queryset = StaffMember.objects.filter(is_active=True)
    serializer_class = StaffMemberSerializer
    permission_classes = [permissions.AllowAny]


class MembershipApplicationViewSet(viewsets.ModelViewSet):
    """Handle membership applications"""
    serializer_class = MembershipApplicationSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return MembershipApplication.objects.all()
        return MembershipApplication.objects.filter(email=self.request.user.email)
    
    def perform_create(self, serializer):
        serializer.save(application_status='PENDING')


class MembershipPaymentViewSet(viewsets.ModelViewSet):
    """Handle membership payments"""
    serializer_class = MembershipPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return MembershipPayment.objects.all()
        if hasattr(self.request.user, 'member_organization'):
            return MembershipPayment.objects.filter(organization=self.request.user.member_organization)
        return MembershipPayment.objects.none()
