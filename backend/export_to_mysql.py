"""
Script to export SQLite data and create MySQL-compatible dump
"""
import os
import django
import subprocess

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ngo.settings')
django.setup()

from django.core.management import call_command

print("Exporting data from SQLite...")
call_command(
    'dumpdata',
    '--natural-foreign',
    '--natural-primary',
    '--exclude=contenttypes',
    '--exclude=auth.permission',
    '--indent=2',
    '--output=data_backup.json'
)

print("\n✅ Data exported to data_backup.json")
print("\n📋 To import this data to MySQL on your online server:")
print("1. Upload your Django project to the server")
print("2. Update settings.py with MySQL database credentials")
print("3. Run: python manage.py migrate")
print("4. Run: python manage.py loaddata data_backup.json")
print("\n💾 MySQL Configuration Example:")
print("""
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'ngoforum_db',
        'USER': 'your_mysql_user',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        },
    }
}
""")
