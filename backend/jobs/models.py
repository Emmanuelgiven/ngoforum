from django.db import models
from django.core.validators import FileExtensionValidator
from members.models import TimeStampedModel, validate_file_size


class JobAdvertisement(TimeStampedModel):
    """Job postings"""
    JOB_TYPE_CHOICES = [
        ('FULL_TIME', 'Full Time'),
        ('PART_TIME', 'Part Time'),
        ('CONTRACT', 'Contract'),
        ('INTERNSHIP', 'Internship'),
        ('VOLUNTEER', 'Volunteer'),
        ('CONSULTANT', 'Consultant'),
    ]
    
    organization = models.ForeignKey(
        'members.MemberOrganization',
        on_delete=models.CASCADE,
        related_name='job_advertisements'
    )
    job_title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='FULL_TIME')
    
    # Job details
    description = models.TextField()
    requirements = models.TextField()
    responsibilities = models.TextField(blank=True)
    qualifications = models.TextField(blank=True)
    
    # Application details
    application_deadline = models.DateField()
    application_email = models.EmailField()
    application_url = models.URLField(blank=True)
    application_instructions = models.TextField(blank=True)
    
    # Compensation
    salary_range = models.CharField(max_length=100, blank=True)
    
    # Metadata
    posted_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    # Moderation
    is_approved = models.BooleanField(default=True)
    
    # Tracking
    view_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-posted_date']
        verbose_name = 'Job Advertisement'
        verbose_name_plural = 'Job Advertisements'
    
    def __str__(self):
        return f"{self.job_title} at {self.organization.name}"
    
    @property
    def is_expired(self):
        from datetime import date
        return date.today() > self.application_deadline


class Training(TimeStampedModel):
    """Training and capacity development opportunities"""
    title = models.CharField(max_length=255)
    provider = models.CharField(max_length=255, help_text="Training provider/organization")
    description = models.TextField()
    
    # Date and time
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    
    # Location
    location = models.CharField(max_length=255)
    is_online = models.BooleanField(default=False)
    
    # Logistics
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='USD')
    is_free = models.BooleanField(default=False)
    
    # Registration
    registration_link = models.URLField(blank=True)
    registration_deadline = models.DateField(null=True, blank=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=50, blank=True)
    max_participants = models.IntegerField(null=True, blank=True)
    
    # Metadata
    posted_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    # Moderation
    is_approved = models.BooleanField(default=True)
    
    # Submitted by
    submitted_by = models.ForeignKey(
        'members.MemberOrganization',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='submitted_trainings'
    )
    
    class Meta:
        ordering = ['start_date']
        verbose_name = 'Training'
        verbose_name_plural = 'Trainings'
    
    def __str__(self):
        return f"{self.title} by {self.provider}"
    
    @property
    def is_past(self):
        from datetime import date
        return date.today() > (self.end_date or self.start_date)


class TenderAdvertisement(TimeStampedModel):
    """Tender/procurement notices"""
    organization = models.ForeignKey(
        'members.MemberOrganization',
        on_delete=models.CASCADE,
        related_name='tender_advertisements'
    )
    title = models.CharField(max_length=255)
    reference_number = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    category = models.CharField(max_length=200, help_text="e.g., Goods, Services, Works, Consultancy")
    
    # Timeline
    submission_deadline = models.DateTimeField()
    opening_date = models.DateTimeField(null=True, blank=True)
    
    # Contact
    contact_person = models.CharField(max_length=200)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=50, blank=True)
    
    # Documents
    document = models.FileField(
        upload_to='tenders/',
        blank=True,
        validators=[FileExtensionValidator(['pdf', 'doc', 'docx']), validate_file_size]
    )
    external_link = models.URLField(blank=True, help_text="Link to tender document or details")
    
    # Metadata
    posted_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    # Moderation
    is_approved = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-submission_deadline']
        verbose_name = 'Tender Advertisement'
        verbose_name_plural = 'Tender Advertisements'
    
    def __str__(self):
        return f"{self.title} - {self.reference_number}"
    
    @property
    def is_expired(self):
        from datetime import datetime
        from django.utils import timezone
        return timezone.now() > self.submission_deadline
