from rest_framework import serializers
from .models import Resource, ResourceCategory, FAQ, FAQCategory


class ResourceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'order']


class ResourceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.name', read_only=True)
    
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'slug', 'description', 'category', 'category_name',
            'resource_type', 'file', 'external_url', 'thumbnail', 'order',
            'is_featured', 'published_date', 'uploaded_by', 'uploaded_by_name',
            'is_approved', 'download_count', 'created_at', 'updated_at'
        ]


class ResourceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = [
            'title', 'description', 'category', 'resource_type',
            'file', 'external_url', 'thumbnail', 'published_date'
        ]


class FAQCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQCategory
        fields = ['id', 'name', 'slug', 'order']


class FAQSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = FAQ
        fields = [
            'id', 'question', 'answer', 'category', 'category_name',
            'order', 'is_published', 'attachment', 'image',
            'view_count', 'created_at', 'updated_at'
        ]
