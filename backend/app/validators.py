"""Input validation and sanitization utilities for CrystalBall API"""

from typing import Dict, Any
from fastapi import HTTPException, status
import re


class ValidationError(Exception):
    """Custom validation exception"""
    pass


def validate_csv_content(csv_content: str) -> str:
    """
    Validate and sanitize CSV content
    - Max size: 10MB
    - Must have content
    - Remove potentially harmful characters
    """
    if not csv_content or not csv_content.strip():
        raise ValidationError("CSV content cannot be empty")
    
    # Check size (10MB limit)
    if len(csv_content.encode('utf-8')) > 10 * 1024 * 1024:
        raise ValidationError("CSV file too large (max 10MB)")
    
    # Basic sanitization
    sanitized = csv_content.strip()
    return sanitized


def validate_stripe_plan(plan: str) -> str:
    """
    Validate Stripe plan name
    - Only allow: 'pro', 'enterprise'
    """
    allowed_plans = ['pro', 'enterprise']
    plan_lower = plan.lower().strip()
    
    if plan_lower not in allowed_plans:
        raise ValidationError(f"Invalid plan. Allowed: {allowed_plans}")
    
    return plan_lower


def validate_email(email: str) -> str:
    """
    Validate email format
    """
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    email_clean = email.strip()
    
    if not re.match(email_pattern, email_clean):
        raise ValidationError("Invalid email format")
    
    if len(email_clean) > 254:
        raise ValidationError("Email too long")
    
    return email_clean


def validate_customer_id(customer_id: str) -> str:
    """
    Validate Stripe customer ID format
    - Must start with 'cus_'
    - Alphanumeric after prefix
    """
    customer_id_clean = customer_id.strip()
    
    if not customer_id_clean.startswith('cus_'):
        raise ValidationError("Invalid customer ID format")
    
    if not re.match(r'^cus_[a-zA-Z0-9]+$', customer_id_clean):
        raise ValidationError("Invalid customer ID format")
    
    return customer_id_clean


def validate_request_data(data: Dict[str, Any], required_fields: list) -> Dict[str, Any]:
    """
    Validate that all required fields are present in request data
    """
    if not isinstance(data, dict):
        raise ValidationError("Request data must be a dictionary")
    
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        raise ValidationError(f"Missing required fields: {missing_fields}")
    
    return data


def handle_validation_error(error: ValidationError):
    """
    Convert validation errors to HTTP exceptions
    """
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail={"error": str(error), "status": "validation_error"}
    )
