from rest_framework import serializers
from .models import Event, EventAttendance


class EventListSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'theme', 'event_date', 'event_time',
            'location', 'event_type', 'status', 'featured_image',
            'registration_required', 'created_by_name', 'is_approved'
        ]


class EventDetailSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    is_full = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'theme', 'description', 'event_date',
            'event_time', 'end_date', 'location', 'venue', 'event_type',
            'status', 'registration_required', 'registration_link',
            'max_attendees', 'featured_image', 'attachments',
            'created_by', 'created_by_name', 'is_approved', 'is_full',
            'created_at', 'updated_at'
        ]


class EventWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'title', 'theme', 'description', 'event_date', 'event_time',
            'end_date', 'location', 'venue', 'event_type',
            'registration_required', 'registration_link', 'max_attendees',
            'featured_image', 'attachments'
        ]


class EventAttendanceSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = EventAttendance
        fields = [
            'id', 'event', 'event_title', 'organization', 'organization_name',
            'attendee_name', 'attendee_email', 'attendee_phone',
            'registered_at', 'attended', 'notes'
        ]
        read_only_fields = ['registered_at']
