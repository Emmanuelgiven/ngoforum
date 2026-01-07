from django.db import models
from django.utils.text import slugify
from members.models import TimeStampedModel, validate_file_size


class Event(TimeStampedModel):
    """Events and activities"""
    EVENT_TYPE_CHOICES = [
        ('CONFERENCE', 'Conference'),
        ('WORKSHOP', 'Workshop'),
        ('TRAINING', 'Training'),
        ('EXPO', 'Expo'),
        ('MEETING', 'Meeting'),
        ('WEBINAR', 'Webinar'),
        ('OTHER', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('UPCOMING', 'Upcoming'),
        ('ONGOING', 'Ongoing'),
        ('PAST', 'Past'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    theme = models.CharField(max_length=500, blank=True)
    description = models.TextField()
    
    # Date and time
    event_date = models.DateField()
    event_time = models.TimeField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    # Location
    location = models.CharField(max_length=255)
    venue = models.CharField(max_length=255, blank=True)
    
    # Classification
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, default='MEETING')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UPCOMING')
    
    # Registration
    registration_required = models.BooleanField(default=False)
    registration_link = models.URLField(blank=True)
    max_attendees = models.IntegerField(null=True, blank=True)
    
    # Media
    featured_image = models.ImageField(upload_to='events/', blank=True, validators=[validate_file_size])
    attachments = models.FileField(upload_to='events/docs/', blank=True, validators=[validate_file_size])
    
    # Organizer
    created_by = models.ForeignKey(
        'members.MemberOrganization',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='organized_events'
    )
    
    # Moderation (for member-submitted events)
    is_approved = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-event_date']
        verbose_name = 'Event'
        verbose_name_plural = 'Events'
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    @property
    def is_full(self):
        """Check if event is at capacity"""
        if not self.max_attendees:
            return False
        return self.attendances.filter(attended=True).count() >= self.max_attendees


class EventAttendance(TimeStampedModel):
    """Track event attendance/registration"""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendances')
    organization = models.ForeignKey(
        'members.MemberOrganization',
        on_delete=models.CASCADE,
        related_name='event_attendances'
    )
    attendee_name = models.CharField(max_length=200)
    attendee_email = models.EmailField()
    attendee_phone = models.CharField(max_length=50, blank=True)
    registered_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-registered_at']
        verbose_name = 'Event Attendance'
        verbose_name_plural = 'Event Attendances'
        unique_together = ['event', 'attendee_email']
    
    def __str__(self):
        return f"{self.attendee_name} - {self.event.title}"
