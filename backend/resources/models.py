from django.db import models
from django.utils.text import slugify
from django.core.validators import FileExtensionValidator
from members.models import TimeStampedModel, validate_file_size


class ResourceCategory(models.Model):
    """Categories for resources"""
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="CSS icon class or emoji")
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Resource Category'
        verbose_name_plural = 'Resource Categories'
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Resource(TimeStampedModel):
    """Resources, tools, and documents"""
    RESOURCE_TYPE_CHOICES = [
        ('DOCUMENT', 'Document'),
        ('TOOL', 'Tool/Platform'),
        ('LINK', 'External Link'),
        ('FORM', 'Form'),
        ('VIDEO', 'Video'),
        ('GUIDELINE', 'Guideline'),
        ('POLICY', 'Policy'),
    ]
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    category = models.ForeignKey(ResourceCategory, on_delete=models.SET_NULL, null=True, related_name='resources')
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES, default='DOCUMENT')
    
    # File or URL
    file = models.FileField(
        upload_to='resources/',
        blank=True,
        validators=[validate_file_size]
    )
    external_url = models.URLField(blank=True)
    
    # Media
    thumbnail = models.ImageField(upload_to='resources/thumbs/', blank=True, validators=[validate_file_size])
    
    # Display settings
    order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    published_date = models.DateField()
    
    # Uploader tracking
    uploaded_by = models.ForeignKey(
        'members.MemberOrganization',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='uploaded_resources'
    )
    
    # Moderation
    is_approved = models.BooleanField(default=True)
    
    # Download tracking
    download_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-is_featured', 'order', '-published_date']
        verbose_name = 'Resource'
        verbose_name_plural = 'Resources'
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def increment_download_count(self):
        self.download_count += 1
        self.save(update_fields=['download_count'])


class FAQCategory(models.Model):
    """FAQ Categories"""
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'FAQ Category'
        verbose_name_plural = 'FAQ Categories'
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class FAQ(TimeStampedModel):
    """Frequently Asked Questions"""
    question = models.CharField(max_length=500)
    answer = models.TextField()
    category = models.ForeignKey(FAQCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='faqs')
    order = models.IntegerField(default=0)
    is_published = models.BooleanField(default=True)
    
    # Optional attachments
    attachment = models.FileField(
        upload_to='faqs/',
        blank=True,
        validators=[FileExtensionValidator(['pdf', 'doc', 'docx']), validate_file_size]
    )
    image = models.ImageField(upload_to='faqs/images/', blank=True, validators=[validate_file_size])
    
    # View tracking
    view_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'
    
    def __str__(self):
        return self.question
