from rest_framework import serializers
from .models import State, County, Sector, OperationalPresence


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'name', 'code']


class CountySerializer(serializers.ModelSerializer):
    state_name = serializers.CharField(source='state.name', read_only=True)
    
    class Meta:
        model = County
        fields = ['id', 'name', 'state', 'state_name']


class SectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector
        fields = ['id', 'name', 'description', 'color_code']


class OperationalPresenceSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    organization_type = serializers.CharField(source='organization.member_type', read_only=True)
    sector_name = serializers.CharField(source='sector.name', read_only=True)
    county_name = serializers.CharField(source='county.name', read_only=True)
    state_name = serializers.ReadOnlyField()
    
    class Meta:
        model = OperationalPresence
        fields = [
            'id', 'organization', 'organization_name', 'organization_type',
            'sector', 'sector_name', 'county', 'county_name', 'state_name',
            'year', 'presence_count', 'is_active', 'notes', 'created_at'
        ]


class OperationalPresenceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationalPresence
        fields = ['sector', 'county', 'year', 'presence_count', 'notes']
