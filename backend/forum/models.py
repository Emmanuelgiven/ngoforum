from django.db import models
from django.utils.text import slugify
from members.models import TimeStampedModel


class ForumCategory(models.Model):
    """Forum discussion categories"""
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Forum Category'
        verbose_name_plural = 'Forum Categories'
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ForumPost(TimeStampedModel):
    """Forum discussion posts"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending Moderation'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    author = models.ForeignKey('members.MemberOrganization', on_delete=models.CASCADE, related_name='forum_posts')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField()
    category = models.ForeignKey(ForumCategory, on_delete=models.SET_NULL, null=True, related_name='posts')
    
    # Moderation
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    # Post settings
    is_pinned = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False, help_text="Locked posts cannot receive new comments")
    
    # Engagement tracking
    view_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-is_pinned', '-created_at']
        verbose_name = 'Forum Post'
        verbose_name_plural = 'Forum Posts'
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while ForumPost.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
    
    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    @property
    def comment_count(self):
        return self.comments.filter(status='APPROVED').count()


class ForumComment(TimeStampedModel):
    """Comments on forum posts"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending Moderation'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey('members.MemberOrganization', on_delete=models.CASCADE, related_name='forum_comments')
    content = models.TextField()
    
    # Moderation
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    # Threading support
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    class Meta:
        ordering = ['created_at']
        verbose_name = 'Forum Comment'
        verbose_name_plural = 'Forum Comments'
    
    def __str__(self):
        return f"Comment by {self.author.name} on {self.post.title}"
