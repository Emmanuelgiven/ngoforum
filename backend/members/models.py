from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils.text import slugify
import os


def validate_file_size(value):
    """Validate that file size is under 15MB"""
    filesize = value.size
    if filesize > 15 * 1024 * 1024:  # 15MB
        raise ValidationError("Maximum file size is 15MB")
    return value


class TimeStampedModel(models.Model):
    """Abstract base model with timestamps"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class MemberOrganization(TimeStampedModel):
    """NGO Member Organizations"""
    MEMBER_TYPE_CHOICES = [
        ('NATIONAL', 'National NGO'),
        ('INTERNATIONAL', 'International NGO'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('PENDING', 'Pending'),
        ('INACTIVE', 'Inactive'),
        ('SUSPENDED', 'Suspended'),
    ]
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    member_type = models.CharField(max_length=20, choices=MEMBER_TYPE_CHOICES)
    rrc_number = models.CharField(max_length=100, blank=True, help_text="RRC Registration Number")
    registration_date = models.DateField(null=True, blank=True)
    
    # Contact information
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    address = models.TextField()
    city = models.CharField(max_length=100, default='Juba')
    state = models.CharField(max_length=100, blank=True)
    
    # Organization details
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='logos/', blank=True, validators=[validate_file_size])
    
    # Membership status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    date_joined = models.DateField(auto_now_add=True)
    
    # Verification and auto-approval
    is_verified = models.BooleanField(default=False, help_text="Verified members get auto-approval for content")
    auto_approve_content = models.BooleanField(default=False)
    
    # Payment tracking
    membership_fee_paid = models.BooleanField(default=False)
    membership_expiry_date = models.DateField(null=True, blank=True)
    
    # User association
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='member_organization')
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Member Organization'
        verbose_name_plural = 'Member Organizations'
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def is_membership_expiring_soon(self):
        """Check if membership expires within 30 days"""
        if not self.membership_expiry_date:
            return False
        from datetime import date, timedelta
        return date.today() + timedelta(days=30) >= self.membership_expiry_date >= date.today()


class OrganizationContact(TimeStampedModel):
    """Contact persons for member organizations"""
    organization = models.ForeignKey(MemberOrganization, on_delete=models.CASCADE, related_name='contacts')
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    is_primary = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-is_primary', 'name']
        verbose_name = 'Organization Contact'
        verbose_name_plural = 'Organization Contacts'
    
    def __str__(self):
        return f"{self.name} - {self.organization.name}"


class StaffMember(TimeStampedModel):
    """NGO Forum Secretariat Staff"""
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='staff/', blank=True, validators=[validate_file_size])
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Staff Member'
        verbose_name_plural = 'Staff Members'
    
    def __str__(self):
        return f"{self.name} - {self.position}"


class MembershipApplication(TimeStampedModel):
    """New membership applications"""
    ORG_TYPE_CHOICES = [
        ('NATIONAL', 'National NGO'),
        ('INTERNATIONAL', 'International NGO'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('UNDER_REVIEW', 'Under Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    # Organization details
    organization_name = models.CharField(max_length=255)
    organization_type = models.CharField(max_length=20, choices=ORG_TYPE_CHOICES)
    rrc_registration = models.CharField(max_length=100, help_text="RRC Registration Number")
    rrc_certificate = models.FileField(
        upload_to='applications/certificates/',
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png']), validate_file_size]
    )
    
    # Contact details
    address = models.TextField()
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    website = models.URLField(blank=True)
    
    # Focal person
    focal_person_name = models.CharField(max_length=200)
    focal_person_title = models.CharField(max_length=200)
    focal_person_email = models.EmailField()
    focal_person_phone = models.CharField(max_length=50)
    
    # Operational details
    areas_of_work = models.TextField(help_text="Describe your organization's areas of work")
    operational_counties = models.TextField(help_text="List counties where your organization operates")
    
    # Supporting documents
    supporting_documents = models.FileField(
        upload_to='applications/docs/',
        blank=True,
        validators=[FileExtensionValidator(['pdf', 'zip']), validate_file_size]
    )
    
    # Application status
    application_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    submitted_date = models.DateTimeField(auto_now_add=True)
    reviewed_date = models.DateTimeField(null=True, blank=True)
    reviewer_notes = models.TextField(blank=True)
    
    # Link to created organization if approved
    approved_organization = models.OneToOneField(
        MemberOrganization,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='application'
    )
    
    class Meta:
        ordering = ['-submitted_date']
        verbose_name = 'Membership Application'
        verbose_name_plural = 'Membership Applications'
    
    def __str__(self):
        return f"{self.organization_name} - {self.application_status}"


class MembershipPayment(TimeStampedModel):
    """Membership fee payments"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    ]
    
    organization = models.ForeignKey(MemberOrganization, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=200.00)
    payment_date = models.DateField(auto_now_add=True)
    transaction_reference = models.CharField(max_length=255, blank=True)
    payment_method = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    receipt = models.FileField(
        upload_to='payments/receipts/',
        blank=True,
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png']), validate_file_size]
    )
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-payment_date']
        verbose_name = 'Membership Payment'
        verbose_name_plural = 'Membership Payments'
    
    def __str__(self):
        return f"{self.organization.name} - ${self.amount} ({self.status})"
