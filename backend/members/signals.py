from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
from .models import MembershipPayment, MemberOrganization


@receiver(post_save, sender=MembershipPayment)
def handle_payment_completion(sender, instance, created, **kwargs):
    """
    When a payment is marked as completed, update organization verification status
    and extend membership expiry date by 1 year
    """
    if instance.status == 'COMPLETED' and instance.organization:
        org = instance.organization
        
        # Mark membership fee as paid
        org.membership_fee_paid = True
        
        # Set or extend membership expiry date by 1 year
        if org.membership_expiry_date and org.membership_expiry_date > timezone.now().date():
            # Extend from current expiry
            org.membership_expiry_date = org.membership_expiry_date + timedelta(days=365)
        else:
            # Set new expiry from today
            org.membership_expiry_date = timezone.now().date() + timedelta(days=365)
        
        # Verify the member and enable auto-approval
        org.is_verified = True
        org.auto_approve_content = True
        
        # Activate if pending
        if org.status == 'PENDING':
            org.status = 'ACTIVE'
        
        org.save()
