"""Middleware for rate limiting, logging, and error handling"""

import time
import logging
from typing import Callable
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
from collections import defaultdict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory rate limit storage (in production, use Redis)
request_log = defaultdict(list)


class RateLimiter:
    """
    Simple in-memory rate limiter
    - Max 100 requests per minute per IP
    - Can be upgraded to Redis for production
    """
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
    
    def is_allowed(self, client_ip: str) -> bool:
        """Check if request is allowed for this IP"""
        now = time.time()
        cutoff = now - self.window_seconds
        
        # Clean old requests
        request_log[client_ip] = [
            req_time for req_time in request_log[client_ip]
            if req_time > cutoff
        ]
        
        # Check limit
        if len(request_log[client_ip]) >= self.max_requests:
            return False
        
        # Add current request
        request_log[client_ip].append(now)
        return True


rate_limiter = RateLimiter(max_requests=100, window_seconds=60)


async def rate_limit_middleware(request: Request, call_next: Callable):
    """
    Rate limiting middleware
    Blocks clients exceeding 100 requests per minute
    """
    client_ip = request.client.host
    
    if not rate_limiter.is_allowed(client_ip):
        logger.warning(f"Rate limit exceeded for IP: {client_ip}")
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"error": "Rate limit exceeded", "status": "rate_limited"}
        )
    
    response = await call_next(request)
    return response


async def logging_middleware(request: Request, call_next: Callable):
    """
    Request/response logging middleware
    Logs all API calls with timestamps and durations
    """
    start_time = time.time()
    client_ip = request.client.host
    method = request.method
    path = request.url.path
    
    # Log incoming request
    logger.info(f"[{datetime.now().isoformat()}] {method} {path} from {client_ip}")
    
    try:
        response = await call_next(request)
        duration = time.time() - start_time
        
        # Log response
        logger.info(
            f"[{datetime.now().isoformat()}] {method} {path} "
            f"completed with {response.status_code} in {duration:.2f}s"
        )
        
        return response
    except Exception as e:
        duration = time.time() - start_time
        logger.error(
            f"[{datetime.now().isoformat()}] {method} {path} "
            f"failed with error after {duration:.2f}s: {str(e)}"
        )
        raise


async def error_handler_middleware(request: Request, call_next: Callable):
    """
    Global error handling middleware
    Catches all unhandled exceptions and returns structured error responses
    """
    try:
        response = await call_next(request)
        return response
    except HTTPException:
        # FastAPI HTTPException - pass through
        raise
    except ValueError as e:
        logger.error(f"ValueError: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": str(e), "status": "validation_error"}
        )
    except Exception as e:
        logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Internal server error",
                "status": "server_error",
                "timestamp": datetime.now().isoformat()
            }
        )
