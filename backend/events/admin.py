from django.contrib import admin
from .models import Event, EventAttendance


class EventAttendanceInline(admin.TabularInline):
    model = EventAttendance
    extra = 0
    readonly_fields = ['registered_at']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_date', 'location', 'event_type', 'status', 'is_approved', 'created_by']
    list_filter = ['status', 'event_type', 'is_approved', 'event_date']
    search_fields = ['title', 'description', 'location']
    readonly_fields = ['slug', 'created_at', 'updated_at']
    date_hierarchy = 'event_date'
    inlines = [EventAttendanceInline]
    
    actions = ['approve_events', 'reject_events']
    
    def approve_events(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, f"{queryset.count()} events approved")
    approve_events.short_description = "Approve selected events"
    
    def reject_events(self, request, queryset):
        queryset.update(is_approved=False)
        self.message_user(request, f"{queryset.count()} events rejected")
    reject_events.short_description = "Reject selected events"


@admin.register(EventAttendance)
class EventAttendanceAdmin(admin.ModelAdmin):
    list_display = ['attendee_name', 'event', 'organization', 'registered_at', 'attended']
    list_filter = ['attended', 'registered_at']
    search_fields = ['attendee_name', 'attendee_email', 'event__title']
    readonly_fields = ['registered_at']
