import sys
import os

# Add the 'server' directory to the Python path
# This allows us to import from your existing server folder
sys.path.append(os.path.join(os.path.dirname(__file__), '../server'))

# Import the FastAPI app from your server.py
from server import app