# server/main_backend/services/auth.py

from fastapi import Depends, HTTPException, status, Request
from supabase import create_client, Client
import os

# Initialize Supabase client (reuse your existing keys)
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")  # use service role key for server
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def get_current_user(request: Request):
    """
    Extracts user info from Supabase JWT and returns internal user_id.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid token")

    token = auth_header.split(" ")[1]

    try:
        # Verify JWT with Supabase
        user_resp = supabase.auth.get_user(token)
        if user_resp.user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
        auth_id = user_resp.user.id

        # Lookup internal user_id in users table
        user_data = supabase.table("users").select("id").eq("auth_uid", auth_id).single().execute()
        if not user_data.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        return user_data.data["id"]

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Auth error: {str(e)}")
