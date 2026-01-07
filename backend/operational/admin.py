from django.contrib import admin
from .models import State, County, Sector, OperationalPresence


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ['name', 'code']
    search_fields = ['name', 'code']


@admin.register(County)
class CountyAdmin(admin.ModelAdmin):
    list_display = ['name', 'state']
    list_filter = ['state']
    search_fields = ['name', 'state__name']
    list_select_related = ['state']


@admin.register(Sector)
class SectorAdmin(admin.ModelAdmin):
    list_display = ['name', 'color_code']
    search_fields = ['name']


@admin.register(OperationalPresence)
class OperationalPresenceAdmin(admin.ModelAdmin):
    list_display = ['organization', 'sector', 'county', 'year', 'presence_count', 'is_active']
    list_filter = ['year', 'is_active', 'sector', 'county__state']
    search_fields = ['organization__name', 'sector__name', 'county__name']
    list_select_related = ['organization', 'sector', 'county', 'county__state']
    autocomplete_fields = ['organization', 'sector', 'county']
    date_hierarchy = 'created_at'
