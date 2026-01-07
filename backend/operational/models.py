from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class State(models.Model):
    """South Sudan States"""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, blank=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = 'State'
        verbose_name_plural = 'States'
    
    def __str__(self):
        return self.name


class County(models.Model):
    """Counties within States"""
    name = models.CharField(max_length=100)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='counties')
    
    class Meta:
        ordering = ['state__name', 'name']
        verbose_name = 'County'
        verbose_name_plural = 'Counties'
        unique_together = ['name', 'state']
    
    def __str__(self):
        return f"{self.name}, {self.state.name}"


class Sector(models.Model):
    """Humanitarian/Development Sectors (Clusters)"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color_code = models.CharField(max_length=7, blank=True, help_text="Hex color code (e.g., #FF5733)")
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Sector'
        verbose_name_plural = 'Sectors'
    
    def __str__(self):
        return self.name


class OperationalPresence(models.Model):
    """3W Data - Who does What Where"""
    organization = models.ForeignKey('members.MemberOrganization', on_delete=models.CASCADE, related_name='operational_presence')
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE, related_name='presences')
    county = models.ForeignKey(County, on_delete=models.CASCADE, related_name='presences')
    year = models.IntegerField(validators=[MinValueValidator(2010), MaxValueValidator(2030)])
    presence_count = models.IntegerField(default=1, help_text="Number of projects/activities")
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-year', 'organization__name']
        verbose_name = 'Operational Presence'
        verbose_name_plural = 'Operational Presences'
        unique_together = ['organization', 'sector', 'county', 'year']
    
    def __str__(self):
        return f"{self.organization.name} - {self.sector.name} in {self.county.name} ({self.year})"
    
    @property
    def state_name(self):
        return self.county.state.name
