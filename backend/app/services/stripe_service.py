import os
import stripe
from typing import Dict, Optional
from datetime import datetime

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class StripeService:
    """Service for handling Stripe payment operations"""
    
    PRICING_PLANS = {
        "free": {"name": "Gratuito", "price": 0, "stripe_price_id": None},
        "pro": {"name": "Premium", "price": 999, "stripe_price_id": os.getenv("STRIPE_PRICE_PRO_MONTHLY")},
        "business": {"name": "Enterprise", "price": None, "stripe_price_id": os.getenv("STRIPE_PRICE_BUSINESS")},
    }
    
    @staticmethod
    def create_checkout_session(user_email: str, plan: str, success_url: str, cancel_url: str) -> Dict:
        """
        Create a Stripe checkout session for payment
        
        Args:
            user_email: Customer email
            plan: Plan type (free, pro, business)
            success_url: Redirect URL after successful payment
            cancel_url: Redirect URL if user cancels
            
        Returns:
            Dictionary with session_id and checkout_url
        """
        try:
            if plan not in StripeService.PRICING_PLANS:
                raise ValueError(f"Invalid plan: {plan}")
            
            plan_data = StripeService.PRICING_PLANS[plan]
            
            # Free plan doesn't need Stripe
            if plan == "free":
                return {
                    "status": "success",
                    "message": "Free plan activated",
                    "plan": plan
                }
            
            # Create session for paid plans
            session = stripe.checkout.Session.create(
                customer_email=user_email,
                payment_method_types=["card"],
                line_items=[
                    {
                        "price": plan_data["stripe_price_id"],
                        "quantity": 1,
                    }
                ],
                mode="subscription",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    "plan": plan,
                    "user_email": user_email
                }
            )
            
            return {
                "status": "success",
                "session_id": session.id,
                "checkout_url": session.url,
                "plan": plan
            }
            
        except stripe.error.StripeError as e:
            return {
                "status": "error",
                "message": str(e),
                "code": e.code
            }
    
    @staticmethod
    def verify_webhook(payload: bytes, sig_header: str) -> Optional[Dict]:
        """
        Verify and process Stripe webhook event
        
        Args:
            payload: Raw request body
            sig_header: Stripe signature header
            
        Returns:
            Parsed event if valid, None otherwise
        """
        try:
            endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
            return event
        except ValueError:
            return None
        except stripe.error.SignatureVerificationError:
            return None
    
    @staticmethod
    def handle_checkout_complete(session_id: str) -> Dict:
        """
        Handle successful checkout completion
        
        Args:
            session_id: Stripe session ID
            
        Returns:
            Dictionary with subscription details
        """
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            
            return {
                "status": "success",
                "customer_email": session.customer_email,
                "plan": session.metadata.get("plan"),
                "subscription_id": session.subscription,
                "amount_paid": session.amount_total
            }
        except stripe.error.StripeError as e:
            return {"status": "error", "message": str(e)}
    
    @staticmethod
    def get_subscription_status(subscription_id: str) -> Dict:
        """
        Get subscription status
        
        Args:
            subscription_id: Stripe subscription ID
            
        Returns:
            Dictionary with subscription details
        """
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            return {
                "status": subscription.status,
                "plan": subscription.metadata.get("plan"),
                "current_period_start": datetime.fromtimestamp(subscription.current_period_start),
                "current_period_end": datetime.fromtimestamp(subscription.current_period_end),
                "cancel_at_period_end": subscription.cancel_at_period_end
            }
        except stripe.error.StripeError as e:
            return {"status": "error", "message": str(e)}
    
    @staticmethod
    def cancel_subscription(subscription_id: str) -> Dict:
        """
        Cancel a subscription
        
        Args:
            subscription_id: Stripe subscription ID
            
        Returns:
            Dictionary with cancellation details
        """
        try:
            subscription = stripe.Subscription.delete(subscription_id)
            return {"status": "success", "message": "Subscription canceled"}
        except stripe.error.StripeError as e:
            return {"status": "error", "message": str(e)}
