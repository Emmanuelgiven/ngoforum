import json
from pathlib import Path
from datetime import datetime, date
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from members.models import MemberOrganization, StaffMember
from operational.models import State, County, Sector, OperationalPresence
from resources.models import Resource, ResourceCategory, FAQ, FAQCategory
from events.models import Event
from pages.models import Page
from tqdm import tqdm


class Command(BaseCommand):
    help = 'Import scraped data from JSON files into database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Run without making database changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        if dry_run:
            self.stdout.write(self.style.WARNING('Running in DRY RUN mode - no changes will be saved'))
        
        self.stdout.write(self.style.SUCCESS('Starting data import...'))
        
        data_dir = Path('data/scraped')
        
        if not data_dir.exists():
            self.stdout.write(self.style.ERROR(f'Data directory {data_dir} does not exist!'))
            self.stdout.write('Run: python manage.py scrape_legacy_site first')
            return
        
        # Import in order of dependencies
        self.import_members(data_dir, dry_run)
        self.import_staff(data_dir, dry_run)
        self.import_3w_data(data_dir, dry_run)
        self.import_resources(data_dir, dry_run)
        self.import_faqs(data_dir, dry_run)
        self.import_events(data_dir, dry_run)
        self.import_pages(data_dir, dry_run)
        
        self.stdout.write(self.style.SUCCESS('\nImport completed!'))

    def import_members(self, data_dir, dry_run):
        """Import member organizations"""
        self.stdout.write('\nImporting members...')
        
        file_path = data_dir / 'members.json'
        if not file_path.exists():
            self.stdout.write(self.style.WARNING('  members.json not found, skipping'))
            return
        
        with open(file_path, 'r', encoding='utf-8') as f:
            members_data = json.load(f)
        
        created_count = 0
        skipped_count = 0
        
        for member_data in tqdm(members_data, desc='Members'):
            try:
                if not member_data.get('name'):
                    skipped_count += 1
                    continue
                
                # Check if already exists
                slug = slugify(member_data['name'])
                if MemberOrganization.objects.filter(slug=slug).exists():
                    skipped_count += 1
                    continue
                
                if not dry_run:
                    MemberOrganization.objects.create(
                        name=member_data['name'],
                        slug=slug,
                        member_type=member_data.get('member_type', 'NATIONAL'),
                        email=member_data.get('email', f'info@{slug}.org'),
                        phone=member_data.get('phone', ''),
                        address=member_data.get('address', 'Juba, South Sudan'),
                        description=member_data.get('description', ''),
                        status='ACTIVE',
                        is_verified=False,
                        auto_approve_content=False,
                        membership_fee_paid=False
                    )
                
                created_count += 1
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  Error importing {member_data.get("name")}: {str(e)}'))
        
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_count}, Skipped: {skipped_count}'))

    def import_staff(self, data_dir, dry_run):
        """Import staff members"""
        self.stdout.write('\nImporting staff...')
        
        file_path = data_dir / 'staff.json'
        if not file_path.exists():
            self.stdout.write(self.style.WARNING('  staff.json not found, skipping'))
            return
        
        with open(file_path, 'r', encoding='utf-8') as f:
            staff_data = json.load(f)
        
        created_count = 0
        
        for idx, staff_member in enumerate(staff_data):
            if not staff_member.get('name'):
                continue
            
            if not dry_run:
                StaffMember.objects.get_or_create(
                    name=staff_member['name'],
                    defaults={
                        'position': staff_member.get('position', ''),
                        'email': staff_member.get('email', ''),
                        'phone': staff_member.get('phone', ''),
                        'bio': staff_member.get('bio', ''),
                        'order': idx + 1,
                        'is_active': True
                    }
                )
            
            created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_count} staff members'))

    def import_3w_data(self, data_dir, dry_run):
        """Import 3W operational presence data"""
        self.stdout.write('\nImporting 3W operational data...')
        
        file_path = data_dir / '3w_data.json'
        if not file_path.exists():
            self.stdout.write(self.style.WARNING('  3w_data.json not found, skipping'))
            return
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data_3w = json.load(f)
        
        created_count = 0
        skipped_count = 0
        
        for record in tqdm(data_3w, desc='3W records'):
            try:
                # Find organization
                org_name = record.get('organization', '').strip()
                if not org_name:
                    skipped_count += 1
                    continue
                
                org = MemberOrganization.objects.filter(name__icontains=org_name).first()
                if not org:
                    skipped_count += 1
                    continue
                
                # Find sector
                sector_name = record.get('sector', '').strip()
                sector = Sector.objects.filter(name__icontains=sector_name).first()
                if not sector:
                    skipped_count += 1
                    continue
                
                # Find county
                county_name = record.get('county', '').strip()
                county = County.objects.filter(name__icontains=county_name).first()
                if not county:
                    skipped_count += 1
                    continue
                
                # Get year
                try:
                    year = int(record.get('year', 2024))
                except:
                    year = 2024
                
                if not dry_run:
                    OperationalPresence.objects.get_or_create(
                        organization=org,
                        sector=sector,
                        county=county,
                        year=year,
                        defaults={
                            'presence_count': record.get('presence_count', 1),
                            'is_active': True
                        }
                    )
                
                created_count += 1
                
            except Exception as e:
                skipped_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_count}, Skipped: {skipped_count}'))

    def import_resources(self, data_dir, dry_run):
        """Import resources"""
        self.stdout.write('\nImporting resources...')
        
        file_path = data_dir / 'resources.json'
        if not file_path.exists():
            self.stdout.write(self.style.WARNING('  resources.json not found, skipping'))
            return
        
        with open(file_path, 'r', encoding='utf-8') as f:
            resources_data = json.load(f)
        
        # Create default category
        if not dry_run:
            default_category, _ = ResourceCategory.objects.get_or_create(
                name='General',
                defaults={'description': 'General resources and tools'}
            )
        
        created_count = 0
        
        for resource_data in resources_data:
            if not resource_data.get('title'):
                continue
            
            slug = slugify(resource_data['title'])
            
            if not dry_run and not Resource.objects.filter(slug=slug).exists():
                Resource.objects.create(
                    title=resource_data['title'],
                    slug=slug,
                    description=resource_data.get('description', ''),
                    category=default_category,
                    resource_type=resource_data.get('resource_type', 'TOOL'),
                    external_url=resource_data.get('external_url', ''),
                    published_date=date.today(),
                    is_approved=True
                )
                created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_count} resources'))

    def import_faqs(self, data_dir, dry_run):
        """Import FAQs"""
        self.stdout.write('\nImporting FAQs...')
        
        file_path = data_dir / 'faqs.json'
        if not file_path.exists():
            self.stdout.write(self.style.WARNING('  faqs.json not found, skipping'))
            return
        
        with open(file_path, 'r', encoding='utf-8') as f:
            faqs_data = json.load(f)
        
        created_count = 0
        
        for faq_data in faqs_data:
            if not faq_data.get('question'):
                continue
            
            # Get or create category
            category = None
            if faq_data.get('category') and not dry_run:
                category, _ = FAQCategory.objects.get_or_create(
                    name=faq_data['category'],
                    defaults={'slug': slugify(faq_data['category'])}
                )
            
            if not dry_run:
                FAQ.objects.get_or_create(
                    question=faq_data['question'],
                    defaults={
                        'answer': faq_data.get('answer', ''),
                        'category': category,
                        'is_published': True
                    }
                )
            
            created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_count} FAQs'))

    def import_events(self, data_dir, dry_run):
        """Import events"""
        self.stdout.write('\nImporting events...')
        
        file_path = data_dir / 'events.json'
        if not file_path.exists():
            self.stdout.write(self.style.WARNING('  events.json not found, skipping'))
            return
        
        with open(file_path, 'r', encoding='utf-8') as f:
            events_data = json.load(f)
        
        created_count = 0
        
        for event_data in events_data:
            if not event_data.get('title'):
                continue
            
            slug = slugify(event_data['title'])
            
            # Parse date
            event_date = date.today()
            try:
                if event_data.get('event_date'):
                    event_date = datetime.strptime(event_data['event_date'], '%Y-%m-%d').date()
            except:
                pass
            
            if not dry_run and not Event.objects.filter(slug=slug).exists():
                Event.objects.create(
                    title=event_data['title'],
                    slug=slug,
                    description=event_data.get('description', ''),
                    event_date=event_date,
                    location=event_data.get('location', 'Juba, South Sudan'),
                    status=event_data.get('status', 'PAST'),
                    event_type='OTHER',
                    is_approved=True
                )
                created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_count} events'))

    def import_pages(self, data_dir, dry_run):
        """Import static pages"""
        self.stdout.write('\nImporting pages...')
        
        file_path = data_dir / 'pages.json'
        if not file_path.exists():
            self.stdout.write(self.style.WARNING('  pages.json not found, skipping'))
            return
        
        with open(file_path, 'r', encoding='utf-8') as f:
            pages_data = json.load(f)
        
        created_count = 0
        
        for page_data in pages_data:
            if not page_data.get('title'):
                continue
            
            slug = page_data.get('slug', slugify(page_data['title']))
            
            if not dry_run:
                Page.objects.get_or_create(
                    slug=slug,
                    defaults={
                        'title': page_data['title'],
                        'content': page_data.get('content', ''),
                        'is_published': True
                    }
                )
            
            created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_count} pages'))
