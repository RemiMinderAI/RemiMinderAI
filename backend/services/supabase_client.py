# Store your keys in .env file and load them using python-dotenv.
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

assert SUPABASE_URL is not None, "SUPABASE_URL not set in .env"
assert SUPABASE_KEY is not None, "SUPABASE_SERVICE_ROLE_KEY not set in .env"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)