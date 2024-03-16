import sys
sys.path.insert(0, '/var/www/main_service/api/')
sys.stdout = sys.stderr

from source.app import create_app

application = create_app()