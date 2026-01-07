import json
import os
import time
from pathlib import Path
from django.core.management.base import BaseCommand
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup


class Command(BaseCommand):
    help = 'Scrape content from https://southsudanngoforum.org/'

    def __init__(self):
        super().__init__()
        self.base_url = 'https://southsudanngoforum.org'
        self.driver = None
        self.scraped_data = {
            'members': [],
            'faqs': [],
            'resources': [],
            'events': [],
            'staff': [],
            'pages': [],
            '3w_data': []
        }

    def add_arguments(self, parser):
        parser.add_argument(
            '--headless',
            action='store_true',
            help='Run browser in headless mode',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting web scraper...'))
        
        # Setup Chrome driver
        chrome_options = Options()
        if options['headless']:
            chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        
        try:
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.driver.implicitly_wait(10)
            
            # Scrape different sections
            self.scrape_members()
            self.scrape_faqs()
            self.scrape_resources()
            self.scrape_events()
            self.scrape_staff()
            self.scrape_pages()
            self.scrape_3w_data()
            
            # Save scraped data
            self.save_data()
            
            self.stdout.write(self.style.SUCCESS('Scraping completed successfully!'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error during scraping: {str(e)}'))
            # Save screenshot on error
            if self.driver:
                self.driver.save_screenshot('scraper_error.png')
                self.stdout.write(self.style.WARNING('Screenshot saved as scraper_error.png'))
        
        finally:
            if self.driver:
                self.driver.quit()

    def scrape_members(self):
        """Scrape NGO member directory"""
        self.stdout.write('Scraping members...')
        
        try:
            # Scrape National NGOs
            self.stdout.write('  - National NGOs...')
            self.driver.get(f'{self.base_url}/membership')
            time.sleep(3)
            
            # Try to find and click National NGOs link
            try:
                national_link = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.LINK_TEXT, "National NGOs"))
                )
                national_link.click()
                time.sleep(3)
            except:
                self.stdout.write(self.style.WARNING('    Could not find National NGOs link, trying alternative...'))
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            national_members = self.extract_members_from_page(soup, 'NATIONAL')
            self.scraped_data['members'].extend(national_members)
            self.stdout.write(self.style.SUCCESS(f'    Found {len(national_members)} National NGOs'))
            
            # Scrape International NGOs
            self.stdout.write('  - International NGOs...')
            try:
                intl_link = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.LINK_TEXT, "International NGOs"))
                )
                intl_link.click()
                time.sleep(3)
            except:
                self.stdout.write(self.style.WARNING('    Could not find International NGOs link'))
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            intl_members = self.extract_members_from_page(soup, 'INTERNATIONAL')
            self.scraped_data['members'].extend(intl_members)
            self.stdout.write(self.style.SUCCESS(f'    Found {len(intl_members)} International NGOs'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error scraping members: {str(e)}'))

    def extract_members_from_page(self, soup, member_type):
        """Extract member organizations from HTML"""
        members = []
        
        # Try multiple selectors to find member listings
        # Common patterns: tables, lists, cards
        
        # Try table rows
        rows = soup.find_all('tr')
        for row in rows:
            cells = row.find_all(['td', 'th'])
            if len(cells) > 0:
                text = cells[0].get_text(strip=True)
                if text and len(text) > 3 and text != 'Organization':
                    members.append({
                        'name': text,
                        'member_type': member_type,
                        'email': '',
                        'phone': '',
                        'address': '',
                        'description': ''
                    })
        
        # Try list items
        if not members:
            list_items = soup.find_all('li')
            for item in list_items:
                text = item.get_text(strip=True)
                if text and len(text) > 3:
                    members.append({
                        'name': text,
                        'member_type': member_type,
                        'email': '',
                        'phone': '',
                        'address': '',
                        'description': ''
                    })
        
        # Try divs with specific classes (common in card layouts)
        if not members:
            cards = soup.find_all('div', class_=['member', 'organization', 'card'])
            for card in cards:
                name_elem = card.find(['h2', 'h3', 'h4', 'strong'])
                if name_elem:
                    members.append({
                        'name': name_elem.get_text(strip=True),
                        'member_type': member_type,
                        'email': '',
                        'phone': '',
                        'address': '',
                        'description': card.get_text(strip=True)
                    })
        
        return members

    def scrape_faqs(self):
        """Scrape FAQs"""
        self.stdout.write('Scraping FAQs...')
        
        try:
            self.driver.get(f'{self.base_url}/faqs')
            time.sleep(3)
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Try accordion/collapsible pattern
            accordions = soup.find_all(['div', 'article'], class_=['faq', 'accordion', 'question'])
            
            for accordion in accordions:
                question_elem = accordion.find(['h3', 'h4', 'h5', 'strong', 'dt'])
                answer_elem = accordion.find(['p', 'div', 'dd'])
                
                if question_elem and answer_elem:
                    self.scraped_data['faqs'].append({
                        'question': question_elem.get_text(strip=True),
                        'answer': answer_elem.get_text(strip=True),
                        'category': 'General'
                    })
            
            self.stdout.write(self.style.SUCCESS(f'  Found {len(self.scraped_data["faqs"])} FAQs'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error scraping FAQs: {str(e)}'))

    def scrape_resources(self):
        """Scrape resources and tools"""
        self.stdout.write('Scraping resources...')
        
        try:
            self.driver.get(f'{self.base_url}/resources')
            time.sleep(3)
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Find resource links
            links = soup.find_all('a', href=True)
            
            for link in links:
                href = link.get('href')
                text = link.get_text(strip=True)
                
                # Filter for resource-like links
                if text and len(text) > 5 and any(keyword in text.lower() for keyword in ['tool', 'document', 'resource', 'portal', 'platform', 'form']):
                    self.scraped_data['resources'].append({
                        'title': text,
                        'description': '',
                        'resource_type': 'TOOL' if 'tool' in text.lower() or 'platform' in text.lower() else 'DOCUMENT',
                        'external_url': href if href.startswith('http') else f'{self.base_url}{href}',
                        'category': 'General'
                    })
            
            self.stdout.write(self.style.SUCCESS(f'  Found {len(self.scraped_data["resources"])} resources'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error scraping resources: {str(e)}'))

    def scrape_events(self):
        """Scrape events"""
        self.stdout.write('Scraping events...')
        
        try:
            self.driver.get(f'{self.base_url}/events')
            time.sleep(3)
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Find event listings
            events = soup.find_all(['div', 'article'], class_=['event', 'post', 'item'])
            
            for event in events:
                title_elem = event.find(['h2', 'h3', 'h4'])
                date_elem = event.find(['time', 'span'], class_=['date', 'time'])
                
                if title_elem:
                    self.scraped_data['events'].append({
                        'title': title_elem.get_text(strip=True),
                        'description': event.get_text(strip=True),
                        'event_date': date_elem.get_text(strip=True) if date_elem else '',
                        'location': 'Juba, South Sudan',
                        'status': 'PAST'
                    })
            
            self.stdout.write(self.style.SUCCESS(f'  Found {len(self.scraped_data["events"])} events'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error scraping events: {str(e)}'))

    def scrape_staff(self):
        """Scrape staff directory"""
        self.stdout.write('Scraping staff directory...')
        
        try:
            self.driver.get(f'{self.base_url}/contact')
            time.sleep(3)
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Look for staff listings
            staff_sections = soup.find_all(['div', 'article'], class_=['staff', 'team', 'member'])
            
            for section in staff_sections:
                name_elem = section.find(['h3', 'h4', 'strong'])
                position_elem = section.find(['span', 'p'], class_=['position', 'title', 'role'])
                email_elem = section.find('a', href=lambda x: x and 'mailto:' in x)
                
                if name_elem:
                    self.scraped_data['staff'].append({
                        'name': name_elem.get_text(strip=True),
                        'position': position_elem.get_text(strip=True) if position_elem else '',
                        'email': email_elem.get('href').replace('mailto:', '') if email_elem else '',
                        'phone': '',
                        'bio': ''
                    })
            
            self.stdout.write(self.style.SUCCESS(f'  Found {len(self.scraped_data["staff"])} staff members'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error scraping staff: {str(e)}'))

    def scrape_pages(self):
        """Scrape static pages"""
        self.stdout.write('Scraping static pages...')
        
        pages_to_scrape = [
            {'url': '/about', 'title': 'About Us'},
            {'url': '/membership', 'title': 'Membership'},
            {'url': '/what-we-do', 'title': 'What We Do'},
            {'url': '/contact', 'title': 'Contact Us'},
        ]
        
        for page_info in pages_to_scrape:
            try:
                self.driver.get(f'{self.base_url}{page_info["url"]}')
                time.sleep(2)
                
                soup = BeautifulSoup(self.driver.page_source, 'html.parser')
                
                # Find main content area
                main_content = soup.find(['main', 'article', 'div'], class_=['content', 'main', 'page-content'])
                
                if main_content:
                    self.scraped_data['pages'].append({
                        'title': page_info['title'],
                        'content': main_content.get_text(strip=True),
                        'slug': page_info['url'].strip('/')
                    })
                
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'  Could not scrape {page_info["title"]}: {str(e)}'))
        
        self.stdout.write(self.style.SUCCESS(f'  Found {len(self.scraped_data["pages"])} pages'))

    def scrape_3w_data(self):
        """Scrape 3W operational presence data"""
        self.stdout.write('Scraping 3W operational data...')
        
        try:
            # Navigate to 3W page
            self.driver.get(f'{self.base_url}/3w-mapping')
            time.sleep(5)  # Wait for JavaScript to load
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Try to find data tables
            tables = soup.find_all('table')
            
            for table in tables:
                rows = table.find_all('tr')[1:]  # Skip header
                
                for row in rows:
                    cells = row.find_all(['td', 'th'])
                    if len(cells) >= 4:  # Expecting at least org, sector, county, year
                        try:
                            self.scraped_data['3w_data'].append({
                                'organization': cells[0].get_text(strip=True),
                                'sector': cells[1].get_text(strip=True) if len(cells) > 1 else '',
                                'county': cells[2].get_text(strip=True) if len(cells) > 2 else '',
                                'state': '',
                                'year': cells[3].get_text(strip=True) if len(cells) > 3 else '2024',
                                'presence_count': 1
                            })
                        except:
                            continue
            
            self.stdout.write(self.style.SUCCESS(f'  Found {len(self.scraped_data["3w_data"])} 3W records'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error scraping 3W data: {str(e)}'))
            self.stdout.write(self.style.WARNING('  3W data may require manual import'))

    def save_data(self):
        """Save scraped data to JSON files"""
        self.stdout.write('Saving scraped data...')
        
        # Create data directory
        data_dir = Path('data/scraped')
        data_dir.mkdir(parents=True, exist_ok=True)
        
        # Save each data type to separate JSON file
        for data_type, data in self.scraped_data.items():
            file_path = data_dir / f'{data_type}.json'
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            self.stdout.write(self.style.SUCCESS(f'  Saved {len(data)} items to {file_path}'))
        
        # Save summary
        summary = {
            'total_members': len(self.scraped_data['members']),
            'total_faqs': len(self.scraped_data['faqs']),
            'total_resources': len(self.scraped_data['resources']),
            'total_events': len(self.scraped_data['events']),
            'total_staff': len(self.scraped_data['staff']),
            'total_pages': len(self.scraped_data['pages']),
            'total_3w_records': len(self.scraped_data['3w_data']),
            'scrape_date': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        summary_path = data_dir / 'summary.json'
        with open(summary_path, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2)
        
        self.stdout.write(self.style.SUCCESS(f'\nScraping Summary:'))
        for key, value in summary.items():
            self.stdout.write(f'  {key}: {value}')
