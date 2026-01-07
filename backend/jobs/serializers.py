from rest_framework import serializers
from .models import JobAdvertisement, Training, TenderAdvertisement


class JobAdvertisementSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = JobAdvertisement
        fields = [
            'id', 'organization', 'organization_name', 'job_title', 'location',
            'job_type', 'description', 'requirements', 'responsibilities',
            'qualifications', 'application_deadline', 'application_email',
            'application_url', 'application_instructions', 'salary_range',
            'posted_date', 'is_active', 'is_approved', 'view_count', 'is_expired'
        ]
        read_only_fields = ['posted_date', 'is_approved', 'view_count']


class JobAdvertisementWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobAdvertisement
        fields = [
            'job_title', 'location', 'job_type', 'description', 'requirements',
            'responsibilities', 'qualifications', 'application_deadline',
            'application_email', 'application_url', 'application_instructions',
            'salary_range'
        ]


class TrainingSerializer(serializers.ModelSerializer):
    submitted_by_name = serializers.CharField(source='submitted_by.name', read_only=True)
    is_past = serializers.ReadOnlyField()
    
    class Meta:
        model = Training
        fields = [
            'id', 'title', 'provider', 'description', 'start_date', 'end_date',
            'location', 'is_online', 'cost', 'currency', 'is_free',
            'registration_link', 'registration_deadline', 'contact_email',
            'contact_phone', 'max_participants', 'posted_date', 'is_active',
            'is_approved', 'submitted_by', 'submitted_by_name', 'is_past'
        ]
        read_only_fields = ['posted_date', 'is_approved']


class TrainingWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = [
            'title', 'provider', 'description', 'start_date', 'end_date',
            'location', 'is_online', 'cost', 'currency', 'is_free',
            'registration_link', 'registration_deadline', 'contact_email',
            'contact_phone', 'max_participants'
        ]


class TenderAdvertisementSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = TenderAdvertisement
        fields = [
            'id', 'organization', 'organization_name', 'title', 'reference_number',
            'description', 'category', 'submission_deadline', 'opening_date',
            'contact_person', 'contact_email', 'contact_phone', 'document',
            'external_link', 'posted_date', 'is_active', 'is_approved', 'is_expired'
        ]
        read_only_fields = ['posted_date', 'is_approved']


class TenderAdvertisementWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenderAdvertisement
        fields = [
            'title', 'reference_number', 'description', 'category',
            'submission_deadline', 'opening_date', 'contact_person',
            'contact_email', 'contact_phone', 'document', 'external_link'
        ]
