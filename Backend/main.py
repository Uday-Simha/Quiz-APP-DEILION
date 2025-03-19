from fastapi import FastAPI
from database import engine, Base
from auth import auth_router
from quiz import quiz_router
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI(title="Quiz App API", version="1.0.0")

# Create database tables
Base.metadata.create_all(bind=engine)

# Enable CORS (Allows frontend to communicate with backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(quiz_router, prefix="/quiz", tags=["Quiz"])

