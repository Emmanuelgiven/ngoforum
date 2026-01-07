from rest_framework import serializers
from .models import Page, ContactMessage, ModerationQueue, Announcement


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'content', 'meta_description', 'order', 'is_published', 'created_at', 'updated_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'organization', 'created_at']
        read_only_fields = ['created_at']


class ModerationQueueSerializer(serializers.ModelSerializer):
    content_type_name = serializers.CharField(source='content_type.model', read_only=True)
    submitted_by_name = serializers.CharField(source='submitted_by.name', read_only=True)
    
    class Meta:
        model = ModerationQueue
        fields = [
            'id', 'content_type', 'content_type_name', 'object_id',
            'submitted_by', 'submitted_by_name', 'submission_notes',
            'moderation_status', 'reviewed_by', 'reviewed_at',
            'reviewer_notes', 'created_at'
        ]


class AnnouncementSerializer(serializers.ModelSerializer):
    is_active = serializers.ReadOnlyField()
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'content', 'priority', 'is_published',
            'publish_date', 'expiry_date', 'show_to_all',
            'show_to_members_only', 'is_active', 'created_at'
        ]
