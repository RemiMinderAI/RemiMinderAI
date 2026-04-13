# backend/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
import jwt
import os
from dotenv import load_dotenv

load_dotenv() 

security = HTTPBearer()
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

def get_current_user(credentials=Depends(security)):
    """
    This verifies the Supabase JWT token sent from frontend.
    Gives API the identity of the logged-in user
    It makes sure only logged-in users (patients) can access protected routes.
    Extracts and validates JWT from Authorization header.
    Returns decoded token data if valid, else raises 401.
    """
    token = credentials.credentials  # Extracts token from header

    try:
        decoded_token = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated" 
        )
        return decoded_token  # This will be current_user in endpoints
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except jwt.InvalidAudienceError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token audience"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )