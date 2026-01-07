from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils.text import slugify
from members.models import TimeStampedModel


class Page(TimeStampedModel):
    """Static pages (About, Terms, Privacy, etc.)"""
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField()
    meta_description = models.CharField(max_length=300, blank=True)
    order = models.IntegerField(default=0)
    is_published = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order', 'title']
        verbose_name = 'Page'
        verbose_name_plural = 'Pages'
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class ContactMessage(TimeStampedModel):
    """Messages from contact form"""
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('READ', 'Read'),
        ('REPLIED', 'Replied'),
        ('ARCHIVED', 'Archived'),
    ]
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    subject = models.CharField(max_length=300, blank=True)
    message = models.TextField()
    
    # Optional organization link
    organization = models.ForeignKey(
        'members.MemberOrganization',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='contact_messages'
    )
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    replied_at = models.DateTimeField(null=True, blank=True)
    reply_notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
    
    def __str__(self):
        return f"{self.name} - {self.subject or 'No Subject'}"


class ModerationQueue(TimeStampedModel):
    """Central moderation queue for all content types"""
    MODERATION_STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    # Generic foreign key to any model
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Submission details
    submitted_by = models.ForeignKey(
        'members.MemberOrganization',
        on_delete=models.CASCADE,
        related_name='moderation_submissions'
    )
    submission_notes = models.TextField(blank=True)
    
    # Moderation details
    moderation_status = models.CharField(max_length=20, choices=MODERATION_STATUS_CHOICES, default='PENDING')
    reviewed_by = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='moderation_reviews'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewer_notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['created_at']
        verbose_name = 'Moderation Queue Item'
        verbose_name_plural = 'Moderation Queue'
    
    def __str__(self):
        return f"{self.content_type} - {self.moderation_status}"
    
    def approve(self, user, notes=''):
        """Approve the content"""
        from django.utils import timezone
        self.moderation_status = 'APPROVED'
        self.reviewed_by = user
        self.reviewed_at = timezone.now()
        self.reviewer_notes = notes
        self.save()
        
        # Update the actual content status if it has a status field
        content = self.content_object
        if hasattr(content, 'status'):
            content.status = 'APPROVED'
            content.save()
        elif hasattr(content, 'is_approved'):
            content.is_approved = True
            content.save()
    
    def reject(self, user, notes=''):
        """Reject the content"""
        from django.utils import timezone
        self.moderation_status = 'REJECTED'
        self.reviewed_by = user
        self.reviewed_at = timezone.now()
        self.reviewer_notes = notes
        self.save()
        
        # Update the actual content status if it has a status field
        content = self.content_object
        if hasattr(content, 'status'):
            content.status = 'REJECTED'
            content.save()
        elif hasattr(content, 'is_approved'):
            content.is_approved = False
            content.save()


class Announcement(TimeStampedModel):
    """System announcements and notices"""
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]
    
    title = models.CharField(max_length=255)
    content = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    
    # Publishing
    is_published = models.BooleanField(default=True)
    publish_date = models.DateTimeField()
    expiry_date = models.DateTimeField(null=True, blank=True)
    
    # Target audience
    show_to_all = models.BooleanField(default=True)
    show_to_members_only = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-priority', '-publish_date']
        verbose_name = 'Announcement'
        verbose_name_plural = 'Announcements'
    
    def __str__(self):
        return self.title
    
    @property
    def is_active(self):
        """Check if announcement is currently active"""
        from django.utils import timezone
        now = timezone.now()
        if not self.is_published:
            return False
        if self.publish_date > now:
            return False
        if self.expiry_date and self.expiry_date < now:
            return False
        return True
