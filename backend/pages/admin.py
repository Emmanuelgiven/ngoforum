from django.contrib import admin
from .models import Page, ContactMessage, ModerationQueue, Announcement


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'order', 'is_published', 'created_at']
    list_filter = ['is_published']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    actions = ['mark_read', 'mark_replied', 'archive']
    
    def mark_read(self, request, queryset):
        queryset.update(status='READ')
        self.message_user(request, f"{queryset.count()} messages marked as read")
    mark_read.short_description = "Mark as read"
    
    def mark_replied(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='REPLIED', replied_at=timezone.now())
        self.message_user(request, f"{queryset.count()} messages marked as replied")
    mark_replied.short_description = "Mark as replied"
    
    def archive(self, request, queryset):
        queryset.update(status='ARCHIVED')
        self.message_user(request, f"{queryset.count()} messages archived")
    archive.short_description = "Archive selected messages"


@admin.register(ModerationQueue)
class ModerationQueueAdmin(admin.ModelAdmin):
    list_display = ['content_type', 'submitted_by', 'moderation_status', 'created_at', 'reviewed_by', 'reviewed_at']
    list_filter = ['content_type', 'moderation_status', 'created_at']
    search_fields = ['submitted_by__name', 'reviewer_notes', 'submission_notes']
    readonly_fields = ['content_type', 'object_id', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    actions = ['bulk_approve', 'bulk_reject']
    
    def bulk_approve(self, request, queryset):
        for item in queryset.filter(moderation_status='PENDING'):
            item.approve(request.user, 'Bulk approved')
        self.message_user(request, f"{queryset.count()} items approved")
    bulk_approve.short_description = "Approve selected items"
    
    def bulk_reject(self, request, queryset):
        for item in queryset.filter(moderation_status='PENDING'):
            item.reject(request.user, 'Bulk rejected')
        self.message_user(request, f"{queryset.count()} items rejected")
    bulk_reject.short_description = "Reject selected items"


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'priority', 'is_published', 'publish_date', 'expiry_date', 'show_to_all']
    list_filter = ['priority', 'is_published', 'publish_date']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'publish_date'
