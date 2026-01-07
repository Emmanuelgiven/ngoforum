from django.db import models
from members.models import TimeStampedModel


class SecurityIncident(TimeStampedModel):
    """Security incident reports (6Ws documentation)"""
    SEVERITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]
    
    STATUS_CHOICES = [
        ('REPORTED', 'Reported'),
        ('INVESTIGATING', 'Under Investigation'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
    ]
    
    # Reporter information
    organization = models.ForeignKey(
        'members.MemberOrganization',
        on_delete=models.SET_NULL,
        null=True,
        related_name='security_incidents'
    )
    reporter_name = models.CharField(max_length=200)
    reporter_email = models.EmailField()
    reporter_phone = models.CharField(max_length=50)
    
    # 6Ws - Who, Where, When, What happened, What you did, What you need
    who = models.CharField(max_length=500, help_text="Who was affected?")
    
    # Where
    where_state = models.ForeignKey('operational.State', on_delete=models.SET_NULL, null=True)
    where_county = models.ForeignKey('operational.County', on_delete=models.SET_NULL, null=True)
    where_location = models.CharField(max_length=255, help_text="Specific location/village")
    
    # When
    when_date = models.DateField()
    when_time = models.TimeField(null=True, blank=True)
    
    # What
    what_happened = models.TextField(help_text="What happened? (detailed description)")
    what_you_did = models.TextField(help_text="What actions did you take?")
    what_you_need = models.TextField(help_text="What assistance/support do you need?")
    
    # Classification
    incident_type = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='MEDIUM')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='REPORTED')
    
    # Confidentiality
    is_confidential = models.BooleanField(
        default=False,
        help_text="Confidential reports are only visible to administrators"
    )
    
    # Follow-up
    follow_up_notes = models.TextField(blank=True)
    resolved_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-when_date', '-created_at']
        verbose_name = 'Security Incident'
        verbose_name_plural = 'Security Incidents'
    
    def __str__(self):
        return f"{self.incident_type} - {self.where_location} ({self.when_date})"


class AccessConstraint(TimeStampedModel):
    """Access constraints and impediments reported"""
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('RESOLVED', 'Resolved'),
        ('MONITORING', 'Under Monitoring'),
    ]
    
    CONSTRAINT_TYPE_CHOICES = [
        ('BUREAUCRATIC', 'Bureaucratic'),
        ('PHYSICAL', 'Physical Access'),
        ('SECURITY', 'Security Related'),
        ('POLITICAL', 'Political'),
        ('OTHER', 'Other'),
    ]
    
    # Reporter
    organization = models.ForeignKey(
        'members.MemberOrganization',
        on_delete=models.SET_NULL,
        null=True,
        related_name='access_constraints'
    )
    reporter_name = models.CharField(max_length=200)
    reporter_email = models.EmailField()
    reporter_phone = models.CharField(max_length=50, blank=True)
    
    # Location
    location = models.CharField(max_length=255)
    county = models.ForeignKey('operational.County', on_delete=models.SET_NULL, null=True)
    
    # Constraint details
    constraint_type = models.CharField(max_length=20, choices=CONSTRAINT_TYPE_CHOICES)
    description = models.TextField()
    date_reported = models.DateField()
    date_started = models.DateField(null=True, blank=True, help_text="When did the constraint start?")
    
    # Impact
    affected_activities = models.TextField(blank=True, help_text="What activities are affected?")
    estimated_impact = models.TextField(blank=True, help_text="Estimated impact on operations")
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    resolution_notes = models.TextField(blank=True)
    resolved_date = models.DateField(null=True, blank=True)
    
    class Meta:
        ordering = ['-date_reported']
        verbose_name = 'Access Constraint'
        verbose_name_plural = 'Access Constraints'
    
    def __str__(self):
        return f"{self.constraint_type} in {self.location} ({self.status})"
