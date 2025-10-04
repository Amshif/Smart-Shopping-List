# Imports in auth.py file

from app.shared.dependencies import get_settings
from fastapi import HTTPException
from fastapi.security.api_key import APIKeyHeader
from fastapi import Security, HTTPException
from starlette.status import HTTP_403_FORBIDDEN
from jose import jwt, JWTError





api_key_header = APIKeyHeader(name="x-api-key", auto_error=False)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == get_settings().api_key:
        return api_key_header   
    else:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Unauthorised"
        )
    
    
