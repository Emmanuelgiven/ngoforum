from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings


def send_welcome_email(member):
    """Send welcome email to new member"""
    subject = 'Welcome to South Sudan NGO Forum'
    context = {
        'member': member,
        'site_url': 'https://southsudanngoforum.org'
    }
    
    message = render_to_string('emails/welcome_member.html', context)
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [member.email],
        html_message=message,
        fail_silently=True
    )


def send_content_approved_email(member, content_type, content):
    """Send email when content is approved"""
    subject = f'Your {content_type} has been approved'
    context = {
        'member': member,
        'content_type': content_type,
        'content': content,
        'site_url': 'https://southsudanngoforum.org'
    }
    
    message = render_to_string('emails/content_approved.html', context)
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [member.email],
        html_message=message,
        fail_silently=True
    )


def send_content_rejected_email(member, content_type, reason):
    """Send email when content is rejected"""
    subject = f'Your {content_type} needs revision'
    context = {
        'member': member,
        'content_type': content_type,
        'reason': reason,
        'site_url': 'https://southsudanngoforum.org'
    }
    
    message = render_to_string('emails/content_rejected.html', context)
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [member.email],
        html_message=message,
        fail_silently=True
    )


def send_security_alert_email(incident):
    """Send alert email to staff about security incident"""
    subject = f'SECURITY ALERT: {incident.incident_type} in {incident.where_location}'
    context = {
        'incident': incident,
        'admin_url': 'https://southsudanngoforum.org/admin/'
    }
    
    message = render_to_string('emails/security_alert.html', context)
    
    # Send to all staff
    staff_emails = ['security@southsudanngoforum.org', 'director@southsudanngoforum.org']
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        staff_emails,
        html_message=message,
        fail_silently=True
    )


def send_event_reminder_email(attendees, event):
    """Send reminder email to event attendees"""
    subject = f'Reminder: {event.title} - {event.event_date}'
    
    for attendance in attendees:
        context = {
            'attendee': attendance,
            'event': event,
            'site_url': 'https://southsudanngoforum.org'
        }
        
        message = render_to_string('emails/event_reminder.html', context)
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [attendance.attendee_email],
            html_message=message,
            fail_silently=True
        )


def send_membership_expiring_email(member):
    """Send email when membership is expiring soon"""
    from datetime import date
    days_remaining = (member.membership_expiry_date - date.today()).days
    
    subject = f'Your membership expires in {days_remaining} days'
    context = {
        'member': member,
        'days_remaining': days_remaining,
        'site_url': 'https://southsudanngoforum.org'
    }
    
    message = render_to_string('emails/membership_expiring.html', context)
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [member.email],
        html_message=message,
        fail_silently=True
    )
