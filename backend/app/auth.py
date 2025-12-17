"""JWT Authentication for CrystalBall API"""
from datetime import datetime, timedelta
from typing import Optional
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security scheme
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash password for storage"""
    return pwd_context.hash(password)

def create_access_token(email: str, plan: str = "free", expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token with email and plan"""
    to_encode = {"sub": email, "plan": plan}
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(email: str) -> str:
    """Create JWT refresh token"""
    to_encode = {"sub": email, "type": "refresh"}
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthCredentials = Depends(security)) -> dict:
    """Verify and decode JWT token"""
    token = credentials.credentials
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        return payload
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

def get_current_user(payload: dict = Depends(verify_token)) -> str:
    """Extract current user from token"""
    return payload.get("sub")

def get_user_plan(payload: dict = Depends(verify_token)) -> str:
    """Extract user plan from token"""
    return payload.get("plan", "free")

class JWTBearer:
    """Dependency for protected routes"""
    def __init__(self, required_plan: Optional[str] = None):
        self.required_plan = required_plan
    
    async def __call__(self, credentials: HTTPAuthCredentials = Depends(security)) -> dict:
        """Validate JWT token and check plan if required"""
        payload = verify_token(HTTPAuthCredentials(
            scheme=credentials.scheme, credentials=credentials.credentials
        ))
        
        if self.required_plan:
            user_plan = payload.get("plan", "free")
            plan_tiers = {"free": 0, "pro": 1, "enterprise": 2}
            
            if plan_tiers.get(user_plan, 0) < plan_tiers.get(self.required_plan, 0):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"This feature requires {self.required_plan} plan or higher"
                )
        
        return payload
