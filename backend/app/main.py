from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CrystalBall API", version="1.0.0")

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://crystal-ball.app,
    "https://crystalball-frontend.onrender.com",
    "https://crystalball-frontend.onrender.com/"
    ]
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CrystalBall API v1.0 is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/predictions")
async def get_predictions():
    return []  # Empty array for now

@app.post("/predictions")
async def upload_csv(file: dict):
    return {"message": "CSV received", "status": "success"}
