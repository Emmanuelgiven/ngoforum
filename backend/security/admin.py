from django.contrib import admin
from .models import SecurityIncident, AccessConstraint


@admin.register(SecurityIncident)
class SecurityIncidentAdmin(admin.ModelAdmin):
    list_display = ['organization', 'incident_type', 'where_location', 'when_date', 'severity', 'status', 'is_confidential']
    list_filter = ['severity', 'status', 'is_confidential', 'when_date']
    search_fields = ['organization__name', 'where_location', 'what_happened', 'incident_type']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'when_date'
    
    fieldsets = (
        ('Reporter Information', {
            'fields': ('organization', 'reporter_name', 'reporter_email', 'reporter_phone')
        }),
        ('6Ws - Who', {
            'fields': ('who',)
        }),
        ('6Ws - Where', {
            'fields': ('where_state', 'where_county', 'where_location')
        }),
        ('6Ws - When', {
            'fields': ('when_date', 'when_time')
        }),
        ('6Ws - What', {
            'fields': ('what_happened', 'what_you_did', 'what_you_need')
        }),
        ('Classification', {
            'fields': ('incident_type', 'severity', 'status', 'is_confidential')
        }),
        ('Follow-up', {
            'fields': ('follow_up_notes', 'resolved_date')
        }),
    )


@admin.register(AccessConstraint)
class AccessConstraintAdmin(admin.ModelAdmin):
    list_display = ['organization', 'constraint_type', 'location', 'date_reported', 'status']
    list_filter = ['constraint_type', 'status', 'date_reported']
    search_fields = ['organization__name', 'location', 'description']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date_reported'
