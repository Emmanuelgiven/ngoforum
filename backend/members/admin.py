from django.contrib import admin
from .models import MemberOrganization, OrganizationContact, StaffMember, MembershipApplication, MembershipPayment


class OrganizationContactInline(admin.TabularInline):
    model = OrganizationContact
    extra = 1


@admin.register(MemberOrganization)
class MemberOrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'member_type', 'is_verified', 'membership_fee_paid', 'membership_expiry_date', 'status', 'date_joined']
    list_filter = ['member_type', 'is_verified', 'status', 'state', 'membership_fee_paid']
    search_fields = ['name', 'email', 'rrc_number', 'description']
    readonly_fields = ['slug', 'date_joined', 'created_at', 'updated_at']
    date_hierarchy = 'date_joined'
    inlines = [OrganizationContactInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'member_type', 'rrc_number', 'registration_date', 'logo')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'website', 'address', 'city', 'state')
        }),
        ('Description', {
            'fields': ('description',)
        }),
        ('Membership Status', {
            'fields': ('status', 'date_joined', 'is_verified', 'auto_approve_content')
        }),
        ('Payment & Expiry', {
            'fields': ('membership_fee_paid', 'membership_expiry_date')
        }),
        ('System', {
            'fields': ('user', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_verified', 'mark_unverified']
    
    def mark_verified(self, request, queryset):
        queryset.update(is_verified=True, auto_approve_content=True)
        self.message_user(request, f"{queryset.count()} members marked as verified")
    mark_verified.short_description = "Mark selected as verified"
    
    def mark_unverified(self, request, queryset):
        queryset.update(is_verified=False, auto_approve_content=False)
        self.message_user(request, f"{queryset.count()} members marked as unverified")
    mark_unverified.short_description = "Mark selected as unverified"


@admin.register(OrganizationContact)
class OrganizationContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'title', 'email', 'phone', 'is_primary']
    list_filter = ['is_primary']
    search_fields = ['name', 'email', 'organization__name']


@admin.register(StaffMember)
class StaffMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'email', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'position', 'email']
    ordering = ['order', 'name']


@admin.register(MembershipApplication)
class MembershipApplicationAdmin(admin.ModelAdmin):
    list_display = ['organization_name', 'organization_type', 'application_status', 'submitted_date']
    list_filter = ['organization_type', 'application_status', 'submitted_date']
    search_fields = ['organization_name', 'email', 'rrc_registration']
    readonly_fields = ['submitted_date', 'reviewed_date']
    date_hierarchy = 'submitted_date'
    
    fieldsets = (
        ('Organization Information', {
            'fields': ('organization_name', 'organization_type', 'rrc_registration', 'rrc_certificate')
        }),
        ('Contact Details', {
            'fields': ('address', 'email', 'phone', 'website')
        }),
        ('Focal Person', {
            'fields': ('focal_person_name', 'focal_person_title', 'focal_person_email', 'focal_person_phone')
        }),
        ('Operational Details', {
            'fields': ('areas_of_work', 'operational_counties', 'supporting_documents')
        }),
        ('Application Status', {
            'fields': ('application_status', 'submitted_date', 'reviewed_date', 'reviewer_notes', 'approved_organization')
        }),
    )


@admin.register(MembershipPayment)
class MembershipPaymentAdmin(admin.ModelAdmin):
    list_display = ['organization', 'amount', 'payment_date', 'status', 'transaction_reference']
    list_filter = ['status', 'payment_date']
    search_fields = ['organization__name', 'transaction_reference']
    readonly_fields = ['payment_date', 'created_at', 'updated_at']
    date_hierarchy = 'payment_date'
