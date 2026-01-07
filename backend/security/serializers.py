from rest_framework import serializers
from .models import SecurityIncident, AccessConstraint


class SecurityIncidentSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    where_state_name = serializers.CharField(source='where_state.name', read_only=True)
    where_county_name = serializers.CharField(source='where_county.name', read_only=True)
    
    class Meta:
        model = SecurityIncident
        fields = [
            'id', 'organization', 'organization_name', 'reporter_name',
            'reporter_email', 'reporter_phone', 'who', 'where_state',
            'where_state_name', 'where_county', 'where_county_name',
            'where_location', 'when_date', 'when_time', 'what_happened',
            'what_you_did', 'what_you_need', 'incident_type', 'severity',
            'status', 'is_confidential', 'created_at'
        ]
        read_only_fields = ['status']


class SecurityIncidentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityIncident
        fields = [
            'reporter_name', 'reporter_email', 'reporter_phone', 'who',
            'where_state', 'where_county', 'where_location', 'when_date',
            'when_time', 'what_happened', 'what_you_did', 'what_you_need',
            'incident_type', 'severity', 'is_confidential'
        ]


class AccessConstraintSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    county_name = serializers.CharField(source='county.name', read_only=True)
    
    class Meta:
        model = AccessConstraint
        fields = [
            'id', 'organization', 'organization_name', 'reporter_name',
            'reporter_email', 'reporter_phone', 'location', 'county',
            'county_name', 'constraint_type', 'description', 'date_reported',
            'date_started', 'affected_activities', 'estimated_impact',
            'status', 'resolution_notes', 'resolved_date', 'created_at'
        ]
        read_only_fields = ['status']


class AccessConstraintWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessConstraint
        fields = [
            'reporter_name', 'reporter_email', 'reporter_phone', 'location',
            'county', 'constraint_type', 'description', 'date_reported',
            'date_started', 'affected_activities', 'estimated_impact'
        ]
