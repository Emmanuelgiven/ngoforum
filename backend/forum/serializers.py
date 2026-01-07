from rest_framework import serializers
from .models import ForumCategory, ForumPost, ForumComment


class ForumCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumCategory
        fields = ['id', 'name', 'slug', 'description', 'order']


class ForumCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    
    class Meta:
        model = ForumComment
        fields = [
            'id', 'post', 'author', 'author_name', 'content',
            'status', 'parent', 'created_at', 'updated_at'
        ]
        read_only_fields = ['status']


class ForumPostListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    comment_count = serializers.ReadOnlyField()
    
    class Meta:
        model = ForumPost
        fields = [
            'id', 'author', 'author_name', 'title', 'slug', 'category',
            'status', 'is_pinned', 'is_locked', 'view_count',
            'comment_count', 'created_at'
        ]


class ForumPostDetailSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    comments = ForumCommentSerializer(many=True, read_only=True)
    comment_count = serializers.ReadOnlyField()
    
    class Meta:
        model = ForumPost
        fields = [
            'id', 'author', 'author_name', 'title', 'slug', 'content',
            'category', 'category_name', 'status', 'is_pinned', 'is_locked',
            'view_count', 'comment_count', 'comments', 'created_at', 'updated_at'
        ]


class ForumPostWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumPost
        fields = ['title', 'content', 'category']
