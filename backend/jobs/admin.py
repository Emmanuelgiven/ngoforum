from django.contrib import admin
from .models import JobAdvertisement, Training, TenderAdvertisement


@admin.register(JobAdvertisement)
class JobAdvertisementAdmin(admin.ModelAdmin):
    list_display = ['job_title', 'organization', 'location', 'job_type', 'application_deadline', 'is_active', 'is_approved']
    list_filter = ['job_type', 'is_active', 'is_approved', 'posted_date']
    search_fields = ['job_title', 'organization__name', 'location', 'description']
    readonly_fields = ['posted_date', 'view_count', 'created_at', 'updated_at']
    date_hierarchy = 'application_deadline'
    
    actions = ['approve_jobs', 'reject_jobs', 'deactivate_jobs']
    
    def approve_jobs(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, f"{queryset.count()} jobs approved")
    approve_jobs.short_description = "Approve selected jobs"
    
    def reject_jobs(self, request, queryset):
        queryset.update(is_approved=False)
        self.message_user(request, f"{queryset.count()} jobs rejected")
    reject_jobs.short_description = "Reject selected jobs"
    
    def deactivate_jobs(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} jobs deactivated")
    deactivate_jobs.short_description = "Deactivate selected jobs"


@admin.register(Training)
class TrainingAdmin(admin.ModelAdmin):
    list_display = ['title', 'provider', 'start_date', 'location', 'is_free', 'is_active', 'is_approved']
    list_filter = ['is_online', 'is_free', 'is_active', 'is_approved', 'start_date']
    search_fields = ['title', 'provider', 'description']
    readonly_fields = ['posted_date', 'created_at', 'updated_at']
    date_hierarchy = 'start_date'
    
    actions = ['approve_trainings', 'reject_trainings']
    
    def approve_trainings(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, f"{queryset.count()} trainings approved")
    approve_trainings.short_description = "Approve selected trainings"
    
    def reject_trainings(self, request, queryset):
        queryset.update(is_approved=False)
        self.message_user(request, f"{queryset.count()} trainings rejected")
    reject_trainings.short_description = "Reject selected trainings"


@admin.register(TenderAdvertisement)
class TenderAdvertisementAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'reference_number', 'category', 'submission_deadline', 'is_active', 'is_approved']
    list_filter = ['is_active', 'is_approved', 'category', 'posted_date']
    search_fields = ['title', 'reference_number', 'organization__name', 'description']
    readonly_fields = ['posted_date', 'created_at', 'updated_at']
    date_hierarchy = 'submission_deadline'
    
    actions = ['approve_tenders', 'reject_tenders']
    
    def approve_tenders(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, f"{queryset.count()} tenders approved")
    approve_tenders.short_description = "Approve selected tenders"
    
    def reject_tenders(self, request, queryset):
        queryset.update(is_approved=False)
        self.message_user(request, f"{queryset.count()} tenders rejected")
    reject_tenders.short_description = "Reject selected tenders"
