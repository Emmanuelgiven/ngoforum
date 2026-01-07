from django.contrib import admin
from .models import ForumCategory, ForumPost, ForumComment


@admin.register(ForumCategory)
class ForumCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(ForumPost)
class ForumPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status', 'is_pinned', 'is_locked', 'view_count', 'created_at']
    list_filter = ['status', 'is_pinned', 'is_locked', 'category']
    search_fields = ['title', 'content', 'author__name']
    readonly_fields = ['slug', 'view_count', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    actions = ['approve_posts', 'reject_posts', 'pin_posts', 'lock_posts']
    
    def approve_posts(self, request, queryset):
        queryset.update(status='APPROVED')
        self.message_user(request, f"{queryset.count()} posts approved")
    approve_posts.short_description = "Approve selected posts"
    
    def reject_posts(self, request, queryset):
        queryset.update(status='REJECTED')
        self.message_user(request, f"{queryset.count()} posts rejected")
    reject_posts.short_description = "Reject selected posts"
    
    def pin_posts(self, request, queryset):
        queryset.update(is_pinned=True)
        self.message_user(request, f"{queryset.count()} posts pinned")
    pin_posts.short_description = "Pin selected posts"
    
    def lock_posts(self, request, queryset):
        queryset.update(is_locked=True)
        self.message_user(request, f"{queryset.count()} posts locked")
    lock_posts.short_description = "Lock selected posts"


@admin.register(ForumComment)
class ForumCommentAdmin(admin.ModelAdmin):
    list_display = ['post', 'author', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['content', 'author__name', 'post__title']
    readonly_fields = ['created_at', 'updated_at']
    
    actions = ['approve_comments', 'reject_comments']
    
    def approve_comments(self, request, queryset):
        queryset.update(status='APPROVED')
        self.message_user(request, f"{queryset.count()} comments approved")
    approve_comments.short_description = "Approve selected comments"
    
    def reject_comments(self, request, queryset):
        queryset.update(status='REJECTED')
        self.message_user(request, f"{queryset.count()} comments rejected")
    reject_comments.short_description = "Reject selected comments"
