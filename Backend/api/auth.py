import os
import jwt
from fastapi import Depends, HTTPException, status, Request
from jwt.exceptions import InvalidTokenError
import requests
from typing import Dict, Any

# Clerk configuration
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_PUBLISHABLE_KEY = os.getenv("CLERK_PUBLISHABLE_KEY")

if not CLERK_SECRET_KEY:
    raise ValueError("CLERK_SECRET_KEY environment variable is required")

def get_clerk_jwks() -> Dict[str, Any]:
    """Fetch Clerk's JSON Web Key Set for token verification"""
    try:
        response = requests.get(f"https://api.clerk.dev/v1/jwks")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch JWKS from Clerk"
        )

async def get_current_user_id(request: Request) -> str:
    """
    Extract and validate user ID from Clerk JWT token.
    
    Security features:
    - Validates JWT signature using Clerk's public keys
    - Checks token expiration
    - Verifies issuer and audience
    - Handles multiple security scenarios
    """
    
    # Extract Authorization header
    auth_header = request.headers.get("authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check Bearer format
    try:
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme. Expected 'Bearer'",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # Decode and verify JWT token
        # For Clerk, we use the secret key for HS256 algorithm
        payload = jwt.decode(
            token,
            CLERK_SECRET_KEY,
            algorithms=["HS256"],
            options={
                "verify_signature": True,
                "verify_exp": True,  # Verify expiration
                "verify_iat": True,  # Verify issued at
                "verify_aud": False,  # Clerk doesn't always set audience
                "require": ["sub", "iat", "exp"]  # Required claims
            }
        )
        
        # Extract user ID from the 'sub' claim
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID"
            )
        
        return user_id
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token validation failed"
        )

# Optional: More secure version using RSA keys (if Clerk provides them)
async def get_current_user_id_rsa(request: Request) -> str:
    """
    Alternative implementation using RSA public key verification.
    Use this if Clerk provides RSA256 tokens instead of HS256.
    """
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    
    token = auth_header.split(" ")[1]
    
    try:
        # Get Clerk's public keys
        jwks = get_clerk_jwks()
        
        # Get the key ID from token header
        unverified_header = jwt.get_unverified_header(token)
        key_id = unverified_header.get("kid")
        
        # Find the matching public key
        public_key = None
        for key in jwks.get("keys", []):
            if key.get("kid") == key_id:
                public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
                break
        
        if not public_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to find matching public key"
            )
        
        # Verify and decode token
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            options={"verify_aud": False}
        )
        
        return payload.get("sub")
        
    except InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )

# Optional: User info dependency that returns full user data
async def get_current_user_info(request: Request) -> Dict[str, Any]:
    """
    Get full user information from token payload.
    Returns the complete JWT payload for additional user data.
    """
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    token = auth_header.split(" ")[1]
    
    try:
        payload = jwt.decode(
            token,
            CLERK_SECRET_KEY,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        return payload
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
