import importlib.machinery
import importlib.util
import os
import sys


sys.path.insert(0, os.path.dirname(__file__))

def load_source(modname, filename):
    loader = importlib.machinery.SourceFileLoader(modname, filename)
    spec = importlib.util.spec_from_file_location(modname, filename, loader=loader)
    module = importlib.util.module_from_spec(spec)
    loader.exec_module(module)
    return module

wsgi = load_source('wsgi', 'ngo/wsgi.py')

# Wrap application to handle /backend prefix from cPanel
_application = wsgi.application

def application(environ, start_response):
    # Strip /backend prefix from PATH_INFO since Django URLs don't include it
    path_info = environ.get('PATH_INFO', '')
    if path_info.startswith('/backend'):
        environ['PATH_INFO'] = path_info[8:]
        if not environ['PATH_INFO']:
            environ['PATH_INFO'] = '/'
    
    return _application(environ, start_response)
