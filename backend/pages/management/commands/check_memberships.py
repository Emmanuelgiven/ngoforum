from datetime import date, timedelta
from django.core.management.base import BaseCommand
from members.models import MemberOrganization
from pages.emails import send_membership_expiring_email


class Command(BaseCommand):
    help = 'Check for expiring memberships and send warning emails'

    def handle(self, *args, **options):
        self.stdout.write('Checking membership expiry dates...')
        
        today = date.today()
        warning_date = today + timedelta(days=30)
        
        # Find memberships expiring in next 30 days
        expiring_soon = MemberOrganization.objects.filter(
            membership_expiry_date__lte=warning_date,
            membership_expiry_date__gte=today,
            status='ACTIVE'
        )
        
        self.stdout.write(f'Found {expiring_soon.count()} memberships expiring in next 30 days')
        
        for org in expiring_soon:
            days_remaining = (org.membership_expiry_date - today).days
            self.stdout.write(f'  {org.name}: {days_remaining} days remaining')
            
            # Send email notification
            send_membership_expiring_email(org)
            self.stdout.write(f'    Sent expiry warning email')
        
        # Find expired memberships
        expired = MemberOrganization.objects.filter(
            membership_expiry_date__lt=today,
            status='ACTIVE'
        )
        
        if expired.exists():
            self.stdout.write(self.style.WARNING(f'\nFound {expired.count()} expired memberships'))
            
            for org in expired:
                self.stdout.write(self.style.WARNING(f'  {org.name}: expired {(today - org.membership_expiry_date).days} days ago'))
                
                # Update status
                org.status = 'INACTIVE'
                org.is_verified = False
                org.auto_approve_content = False
                org.save()
                
                self.stdout.write(f'    Updated status to INACTIVE')
        
        self.stdout.write(self.style.SUCCESS('\nMembership check completed'))
