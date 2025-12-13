import stripe
from fastapi import APIRouter, Header, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config import settings
from app.db import get_db
from app.models.user import User

stripe.api_key = settings.STRIPE_SECRET_KEY

router = APIRouter()

@router.post("/create-checkout-session")
async def create_checkout_session(plan: str, db: Session = Depends(get_db)): # Add auth depend
    # user_id = current_user.id
    
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': 'Crystal Ball Subscription',
                        },
                        'unit_amount': 1900 if plan == 'monthly' else 19000,
                        'recurring': {
                            'interval': 'month' if plan == 'monthly' else 'year',
                        }
                    },
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=settings.CORS_ORIGINS + '/dashboard?success=true',
            cancel_url=settings.CORS_ORIGINS + '/dashboard?canceled=true',
        )
        return {"sessionId": checkout_session.id, "url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, "whsec_..." # settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        # fulfill order
        pass
    
    return {"status": "success"}
