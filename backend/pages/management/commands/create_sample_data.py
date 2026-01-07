import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from members.models import MemberOrganization
from operational.models import OperationalPresence, State, County, Sector
from events.models import Event
from resources.models import Resource, ResourceCategory
from forum.models import ForumCategory, ForumPost
from jobs.models import JobAdvertisement, Training, TenderAdvertisement


class Command(BaseCommand):
    help = 'Create sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create admin user if doesn't exist
        if not User.objects.filter(username='testuser').exists():
            user = User.objects.create_user('testuser', 'test@example.com', 'password123')
            self.stdout.write(f'  Created test user')
        else:
            user = User.objects.get(username='testuser')

        # Get states, counties, sectors
        states = list(State.objects.all())
        counties = list(County.objects.all())
        sectors = list(Sector.objects.all())

        if not states or not sectors:
            self.stdout.write(self.style.ERROR('Run create_locations and create_sectors first!'))
            return

        # Create sample NGOs
        ngo_names = [
            'Action Against Hunger', 'CARE International', 'Catholic Relief Services',
            'Danish Refugee Council', 'International Rescue Committee', 'Médecins Sans Frontières',
            'Oxfam', 'Save the Children', 'World Vision', 'Plan International',
            'UNICEF', 'UNHCR', 'WFP', 'WHO', 'FAO', 'UNDP', 'IOM', 'Concern Worldwide',
            'Norwegian Refugee Council', 'Handicap International', 'HealthNet TPO',
            'INTERSOS', 'Mercy Corps', 'Relief International', 'Solidarités International',
            'Tearfund', 'Samaritan\'s Purse', 'International Medical Corps',
            'GOAL', 'Premiere Urgence', 'ACTED', 'Triangle GH', 'Malteser International',
            'ZOA', 'Tearfund', 'CHF International', 'Adventist Development',
            'Anglican Church of South Sudan', 'Caritas', 'Episcopal Church',
            'Islamic Relief', 'Lutheran World Federation', 'Mennonite Central Committee',
            'Catholic Diocese of Juba', 'Presbyterian Church', 'World Relief',
            'Africa Humanitarian Action', 'ChildFund', 'Concern Universal',
            'Friends International', 'Hope Worldwide', 'Jesuit Refugee Service'
        ]

        member_count = 0
        for i, name in enumerate(ngo_names[:50], 1):  # Create 50 NGOs
            if not MemberOrganization.objects.filter(name=name).exists():
                org = MemberOrganization.objects.create(
                    name=name,
                    member_type=random.choice(['NATIONAL', 'INTERNATIONAL']),
                    description=f'{name} is a humanitarian organization working in South Sudan.',
                    website=f'https://www.{name.lower().replace(" ", "").replace("'", "")}.org',
                    email=f'info@{name.lower().replace(" ", "").replace("'", "")}.org',
                    phone=f'+211-{random.randint(900, 999)}-{random.randint(100000, 999999)}',
                    address=f'{random.randint(1, 100)} Main Street',
                    city=random.choice(['Juba', 'Wau', 'Malakal', 'Bor', 'Yambio']),
                    state=random.choice([s.name for s in states[:5]]),
                    status='ACTIVE',
                    is_verified=True,
                    membership_expiry_date=(datetime.now() + timedelta(days=random.randint(30, 365))).date()
                )
                member_count += 1

        self.stdout.write(f'  Created {member_count} member organizations')

        # Create 3W operational presence records
        orgs = list(MemberOrganization.objects.all())
        ops_count = 0
        current_year = datetime.now().year
        for org in orgs:
            # Each org has 2-5 operational presences
            for _ in range(random.randint(2, 5)):
                state = random.choice(states)
                county = random.choice([c for c in counties if c.state == state])
                sector = random.choice(sectors)
                year = random.choice([current_year-1, current_year])
                
                # Check if this combination already exists
                if not OperationalPresence.objects.filter(
                    organization=org, county=county, sector=sector, year=year
                ).exists():
                    OperationalPresence.objects.create(
                        organization=org,
                        county=county,
                        sector=sector,
                        year=year,
                        presence_count=random.randint(1, 5),
                        is_active=True,
                        notes=f'{org.name} providing humanitarian services in {county.name}'
                    )
                    ops_count += 1

        self.stdout.write(f'  Created {ops_count} operational presence records')

        # Create events
        event_titles = [
            'NGO Forum Monthly Meeting', 'Humanitarian Coordination Forum',
            'Security Briefing', 'WASH Cluster Meeting', 'Health Sector Review',
            'Protection Working Group', 'Nutrition Cluster Meeting',
            'Education Sector Meeting', 'Food Security Meeting', 'Shelter Cluster Meeting'
        ]
        event_count = 0
        for title in event_titles:
            if not Event.objects.filter(title=title).exists():
                Event.objects.create(
                    title=title,
                    description=f'{title} to discuss coordination and planning in South Sudan.',
                    event_date=(datetime.now() + timedelta(days=random.randint(1, 60))).date(),
                    event_time='09:00:00',
                    location=random.choice(['Juba', 'Wau', 'Malakal', 'Bor', 'Yambio']),
                    venue='NGO Forum Conference Room',
                    event_type='MEETING',
                    is_approved=True
                )
                event_count += 1

        self.stdout.write(f'  Created {event_count} events')

        # Create resource categories and resources
        categories = ['Reports', 'Guidelines', 'Policies', 'Maps', 'Assessments']
        for cat_name in categories:
            ResourceCategory.objects.get_or_create(name=cat_name, description=f'{cat_name} and related documents')

        resource_count = 0
        for i in range(20):
            category = ResourceCategory.objects.order_by('?').first()
            Resource.objects.create(
                category=category,
                title=f'{category.name} Document {i+1}',
                description=f'Important document for humanitarian coordination in South Sudan.',
                resource_type='DOCUMENT',
                published_date=datetime.now().date(),
                is_approved=True
            )
            resource_count += 1

        self.stdout.write(f'  Created {resource_count} resources')

        # Create forum categories and posts
        forum_cats = ['General Discussion', 'Coordination', 'Security Updates', 'Funding Opportunities', 'Job Postings']
        for cat_name in forum_cats:
            ForumCategory.objects.get_or_create(name=cat_name, description=f'Discussions about {cat_name.lower()}')

        post_count = 0
        orgs = list(MemberOrganization.objects.all())
        for i in range(15):
            category = ForumCategory.objects.order_by('?').first()
            ForumPost.objects.create(
                author=random.choice(orgs),
                category=category,
                title=f'Discussion: {category.name} Topic {i+1}',
                content=f'This is an important discussion about {category.name.lower()} in South Sudan humanitarian response.',
                status='APPROVED'
            )
            post_count += 1

        self.stdout.write(f'  Created {post_count} forum posts')

        # Create jobs
        job_count = 0
        for i in range(10):
            org = random.choice(orgs)
            JobAdvertisement.objects.create(
                organization=org,
                job_title=f'{random.choice(["Project Manager", "Field Officer", "WASH Specialist", "Health Coordinator", "M&E Officer"])}',
                description='Looking for experienced professional to join humanitarian team in South Sudan.',
                requirements='Minimum 3 years experience in humanitarian sector required.',
                location=random.choice(['Juba', 'Wau', 'Malakal']),
                job_type='FULL_TIME',
                application_deadline=(datetime.now() + timedelta(days=random.randint(10, 30))).date(),
                application_email=org.email,
                is_approved=True
            )
            job_count += 1

        self.stdout.write(f'  Created {job_count} job postings')

        # Summary
        self.stdout.write(self.style.SUCCESS('\n=== DATA SUMMARY ==='))
        self.stdout.write(f'Member Organizations: {MemberOrganization.objects.count()}')
        self.stdout.write(f'3W Records: {OperationalPresence.objects.count()}')
        self.stdout.write(f'Events: {Event.objects.count()}')
        self.stdout.write(f'Resources: {Resource.objects.count()}')
        self.stdout.write(f'Forum Posts: {ForumPost.objects.count()}')
        self.stdout.write(f'Jobs: {JobAdvertisement.objects.count()}')
        self.stdout.write(self.style.SUCCESS('\nSample data created successfully!'))
