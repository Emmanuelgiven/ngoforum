from django.contrib import admin
from .models import Resource, ResourceCategory, FAQ, FAQCategory


@admin.register(ResourceCategory)
class ResourceCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'resource_type', 'published_date', 'is_featured', 'is_approved', 'download_count']
    list_filter = ['resource_type', 'is_featured', 'is_approved', 'category']
    search_fields = ['title', 'description']
    readonly_fields = ['slug', 'download_count', 'created_at', 'updated_at']
    date_hierarchy = 'published_date'
    
    actions = ['approve_resources', 'reject_resources', 'feature_resources']
    
    def approve_resources(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, f"{queryset.count()} resources approved")
    approve_resources.short_description = "Approve selected resources"
    
    def reject_resources(self, request, queryset):
        queryset.update(is_approved=False)
        self.message_user(request, f"{queryset.count()} resources rejected")
    reject_resources.short_description = "Reject selected resources"
    
    def feature_resources(self, request, queryset):
        queryset.update(is_featured=True)
        self.message_user(request, f"{queryset.count()} resources featured")
    feature_resources.short_description = "Feature selected resources"


@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'order', 'is_published', 'view_count']
    list_filter = ['is_published', 'category']
    search_fields = ['question', 'answer']
    ordering = ['order', '-created_at']
