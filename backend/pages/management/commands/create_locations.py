from django.core.management.base import BaseCommand
from operational.models import State, County


class Command(BaseCommand):
    help = 'Create South Sudan states and counties'

    def handle(self, *args, **options):
        self.stdout.write('Creating South Sudan states and counties...')
        
        # South Sudan states and their counties
        states_data = {
            'Central Equatoria': ['Juba', 'Kajo-Keji', 'Lainya', 'Morobo', 'Terekeka', 'Yei'],
            'Eastern Equatoria': ['Budi', 'Ikotos', 'Kapoeta East', 'Kapoeta North', 'Kapoeta South', 'Magwi', 'Torit'],
            'Jonglei': ['Akobo', 'Ayod', 'Bor South', 'Duk', 'Fangak', 'Nyirol', 'Pigi', 'Pochalla', 'Twic East', 'Uror'],
            'Lakes': ['Awerial', 'Cueibet', 'Rumbek Centre', 'Rumbek East', 'Rumbek North', 'Wulu', 'Yirol East', 'Yirol West'],
            'Northern Bahr el Ghazal': ['Aweil Centre', 'Aweil East', 'Aweil North', 'Aweil South', 'Aweil West'],
            'Unity': ['Abiemnhom', 'Guit', 'Koch', 'Leer', 'Mayendit', 'Mayom', 'Panyijiar', 'Pariang', 'Rubkona'],
            'Upper Nile': ['Baliet', 'Fashoda', 'Longochuk', 'Luakpiny/Nasir', 'Maban', 'Malakal', 'Manyo', 'Melut', 'Panyikang', 'Renk', 'Ulang'],
            'Warrap': ['Gogrial East', 'Gogrial West', 'Tonj East', 'Tonj North', 'Tonj South', 'Twic'],
            'Western Bahr el Ghazal': ['Jur River', 'Raja', 'Wau'],
            'Western Equatoria': ['Ezo', 'Ibba', 'Maridi', 'Mundri East', 'Mundri West', 'Mvolo', 'Nagero', 'Nzara', 'Tambura', 'Yambio'],
        }
        
        created_states = 0
        created_counties = 0
        
        for state_name, counties in states_data.items():
            # Create or get state
            state, created = State.objects.get_or_create(
                name=state_name,
                defaults={'code': state_name[:3].upper()}
            )
            
            if created:
                created_states += 1
                self.stdout.write(self.style.SUCCESS(f'  Created state: {state_name}'))
            
            # Create counties for this state
            for county_name in counties:
                county, created = County.objects.get_or_create(
                    name=county_name,
                    state=state
                )
                
                if created:
                    created_counties += 1
        
        self.stdout.write(self.style.SUCCESS(f'\nCreated {created_states} states and {created_counties} counties'))
        self.stdout.write(self.style.SUCCESS(f'Total: {State.objects.count()} states, {County.objects.count()} counties'))
