#!/usr/bin/env python
"""
Convert Django JSON fixture to MySQL SQL format
"""
import json
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ngo.settings')
django.setup()

from django.apps import apps
from django.db import connection

def escape_sql_string(value):
    """Escape strings for SQL"""
    if value is None:
        return 'NULL'
    if isinstance(value, bool):
        return '1' if value else '0'
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, str):
        value = value.replace('\\', '\\\\')
        value = value.replace("'", "''")
        return f"'{value}'"
    return f"'{str(value)}'"

def get_table_name(model_name):
    """Get actual database table name from model"""
    try:
        app_label, model = model_name.split('.')
        model_class = apps.get_model(app_label, model)
        return model_class._meta.db_table
    except:
        return model_name.replace('.', '_')

def convert_json_to_sql(json_file, sql_file):
    """Convert Django JSON fixture to SQL INSERT statements"""
    
    print(f"Reading {json_file}...")
    with open(json_file, 'r', encoding='utf-8', errors='replace') as f:
        data = json.load(f)
    
    print(f"Converting {len(data)} records to SQL...")
    
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write("-- Django Data Export to MySQL\n")
        f.write(f"-- Generated from {json_file}\n")
        f.write(f"-- Total records: {len(data)}\n\n")
        f.write("SET FOREIGN_KEY_CHECKS=0;\n\n")
        
        # Group by model
        grouped = {}
        for item in data:
            model = item['model']
            if model not in grouped:
                grouped[model] = []
            grouped[model].append(item)
        
        # Generate INSERT statements for each model
        for model_name, items in grouped.items():
            table_name = get_table_name(model_name)
            f.write(f"\n-- {model_name} ({len(items)} records)\n")
            
            for item in items:
                fields = item['fields']
                
                # Get column names and values
                columns = []
                values = []
                
                # Add id if present
                if 'pk' in item:
                    columns.append('id')
                    values.append(str(item['pk']))
                
                for field_name, field_value in fields.items():
                    columns.append(field_name)
                    values.append(escape_sql_string(field_value))
                
                # Generate INSERT statement
                cols_str = ', '.join(columns)
                vals_str = ', '.join(values)
                f.write(f"INSERT INTO {table_name} ({cols_str}) VALUES ({vals_str});\n")
        
        f.write("\nSET FOREIGN_KEY_CHECKS=1;\n")
    
    print(f"\n✓ SQL file created: {sql_file}")
    print(f"✓ File size: {os.path.getsize(sql_file) / 1024:.2f} KB")

if __name__ == '__main__':
    json_file = 'data_backup.json'
    sql_file = 'data_backup.sql'
    
    if not os.path.exists(json_file):
        print(f"Error: {json_file} not found!")
        exit(1)
    
    convert_json_to_sql(json_file, sql_file)
    print("\n✓ Conversion complete!")
    print(f"\nYou can now import this SQL file into MySQL:")
    print(f"mysql -u username -p database_name < {sql_file}")
