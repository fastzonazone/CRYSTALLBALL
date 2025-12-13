from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, upload, predict, billing

app = FastAPI(title="CrystalBall API", version="1.0.0")

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://crystal-ball.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
# # app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
# app.include_router(predict.router, prefix="/api/predict", tags=["Predict"])
# app.include_router(billing.router, prefix="/api/billing", tags=["Billing"])


@app.get("/")
async def root():
    return {"message": "CrystalBall API v1.0 is running 🔮"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
