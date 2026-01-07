from django.core.management.base import BaseCommand
from operational.models import Sector


class Command(BaseCommand):
    help = 'Create humanitarian/development sectors (clusters)'

    def handle(self, *args, **options):
        self.stdout.write('Creating humanitarian sectors...')
        
        # Humanitarian clusters and development sectors
        sectors_data = [
            {
                'name': 'Protection',
                'description': 'Child Protection, GBV, Human Rights, Mine Action, HLP',
                'color_code': '#E74C3C'
            },
            {
                'name': 'Health',
                'description': 'Primary healthcare, disease surveillance, medical services',
                'color_code': '#3498DB'
            },
            {
                'name': 'Education',
                'description': 'Access to education, quality education, education in emergencies',
                'color_code': '#9B59B6'
            },
            {
                'name': 'WASH',
                'description': 'Water, Sanitation, and Hygiene',
                'color_code': '#1ABC9C'
            },
            {
                'name': 'Nutrition',
                'description': 'Treatment and prevention of malnutrition',
                'color_code': '#F39C12'
            },
            {
                'name': 'Food Security and Livelihoods',
                'description': 'Food assistance, agricultural livelihoods, market support',
                'color_code': '#27AE60'
            },
            {
                'name': 'Shelter and NFI',
                'description': 'Emergency shelter, Non-Food Items, Housing',
                'color_code': '#95A5A6'
            },
            {
                'name': 'Logistics',
                'description': 'Transport, warehousing, supply chain',
                'color_code': '#34495E'
            },
            {
                'name': 'Camp Coordination and Camp Management',
                'description': 'IDP/Refugee camp management and coordination',
                'color_code': '#E67E22'
            },
            {
                'name': 'Early Recovery',
                'description': 'Recovery, resilience, durable solutions',
                'color_code': '#16A085'
            },
        ]
        
        created_count = 0
        
        for sector_data in sectors_data:
            sector, created = Sector.objects.get_or_create(
                name=sector_data['name'],
                defaults={
                    'description': sector_data['description'],
                    'color_code': sector_data['color_code']
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'  Created sector: {sector.name}'))
            else:
                # Update description and color if changed
                sector.description = sector_data['description']
                sector.color_code = sector_data['color_code']
                sector.save()
        
        self.stdout.write(self.style.SUCCESS(f'\nCreated {created_count} new sectors'))
        self.stdout.write(self.style.SUCCESS(f'Total: {Sector.objects.count()} sectors'))
