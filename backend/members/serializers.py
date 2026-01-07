from rest_framework import serializers
from .models import MemberOrganization, OrganizationContact, StaffMember, MembershipApplication, MembershipPayment


class OrganizationContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationContact
        fields = ['id', 'name', 'title', 'email', 'phone', 'is_primary', 'created_at']


class MemberOrganizationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    class Meta:
        model = MemberOrganization
        fields = [
            'id', 'name', 'slug', 'member_type', 'logo', 'city', 'state',
            'website', 'email', 'status', 'is_verified', 'date_joined'
        ]


class MemberOrganizationDetailSerializer(serializers.ModelSerializer):
    """Full serializer for detail views"""
    contacts = OrganizationContactSerializer(many=True, read_only=True)
    is_membership_expiring_soon = serializers.ReadOnlyField()
    
    class Meta:
        model = MemberOrganization
        fields = [
            'id', 'name', 'slug', 'member_type', 'rrc_number', 'registration_date',
            'email', 'phone', 'website', 'address', 'city', 'state', 'description',
            'logo', 'status', 'date_joined', 'is_verified', 'auto_approve_content',
            'membership_fee_paid', 'membership_expiry_date', 'is_membership_expiring_soon',
            'contacts', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'is_verified', 'auto_approve_content', 'membership_fee_paid', 'membership_expiry_date']


class MemberOrganizationWriteSerializer(serializers.ModelSerializer):
    """Serializer for member profile updates"""
    class Meta:
        model = MemberOrganization
        fields = [
            'name', 'rrc_number', 'email', 'phone', 'website', 'address',
            'city', 'state', 'description', 'logo'
        ]


class StaffMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffMember
        fields = ['id', 'name', 'position', 'email', 'phone', 'bio', 'photo', 'order', 'is_active']


class MembershipApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipApplication
        fields = [
            'id', 'organization_name', 'organization_type', 'rrc_registration',
            'rrc_certificate', 'address', 'email', 'phone', 'website',
            'focal_person_name', 'focal_person_title', 'focal_person_email',
            'focal_person_phone', 'areas_of_work', 'operational_counties',
            'supporting_documents', 'application_status', 'submitted_date',
            'reviewer_notes'
        ]
        read_only_fields = ['application_status', 'submitted_date', 'reviewer_notes']


class MembershipPaymentSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    
    class Meta:
        model = MembershipPayment
        fields = [
            'id', 'organization', 'organization_name', 'amount', 'payment_date',
            'transaction_reference', 'payment_method', 'status', 'receipt', 'notes'
        ]
        read_only_fields = ['payment_date', 'status']
