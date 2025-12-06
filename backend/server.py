from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from pydantic import BaseModel

from interview_service import interview_service

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Request/Response Models
class QuestionRequest(BaseModel):
    role: str
    count: int = 5
    difficulty: str = 'mixed'

class EvaluationRequest(BaseModel):
    question: dict
    answer: str
    role: str

class MockStartRequest(BaseModel):
    role: str

class MockContinueRequest(BaseModel):
    session_id: str
    answer: str
    role: str
    question_count: int = 0

# API Endpoints
@api_router.get("/")
async def root():
    return {"message": "AI Interview Assistant API is running"}

@api_router.post("/interview/generate-questions")
async def generate_questions(request: QuestionRequest):
    """
    Generate interview questions based on role
    """
    try:
        questions = await interview_service.generate_questions(
            role=request.role,
            count=request.count,
            difficulty=request.difficulty
        )
        return {"questions": questions}
    except Exception as e:
        logger.error(f"Error generating questions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/interview/evaluate-answer")
async def evaluate_answer(request: EvaluationRequest):
    """
    Evaluate an interview answer
    """
    try:
        evaluation = await interview_service.evaluate_answer(
            question=request.question,
            answer=request.answer,
            role=request.role
        )
        return {"evaluation": evaluation}
    except Exception as e:
        logger.error(f"Error evaluating answer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/interview/start-mock")
async def start_mock_interview(request: MockStartRequest):
    """
    Start a mock interview session
    """
    try:
        result = await interview_service.start_mock_interview(role=request.role)
        return result
    except Exception as e:
        logger.error(f"Error starting mock interview: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/interview/mock-continue")
async def continue_mock_interview(request: MockContinueRequest):
    """
    Continue mock interview with next question
    """
    try:
        result = await interview_service.continue_mock_interview(
            session_id=request.session_id,
            answer=request.answer,
            role=request.role,
            question_count=request.question_count
        )
        return result
    except Exception as e:
        logger.error(f"Error continuing mock interview: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()