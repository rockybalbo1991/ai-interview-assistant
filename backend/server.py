from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from datetime import datetime, timezone

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
        conversation = Conversation(
            title=conversation_input.title or "New note"
        )
        
        # Save to database
        conversation_dict = conversation.dict()
        await conversations_collection.insert_one(conversation_dict)
        
        logger.info(f"Created conversation: {conversation.id}")
        return conversation
        
    except Exception as e:
        logger.error(f"Error creating conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/conversations", response_model=List[ConversationSummary])
async def get_conversations():
    """
    Get all conversations (sorted by most recent)
    """
    try:
        # Get all conversations sorted by updated_at
        conversations = await conversations_collection.find({}, {"_id": 0}).sort("updated_at", -1).to_list(1000)
        
        # Transform to summary format
        summaries = [
            ConversationSummary(
                id=conv["id"],
                title=conv.get("title", "New note"),
                timestamp=conv["updated_at"]
            )
            for conv in conversations
        ]
        
        return summaries
        
    except Exception as e:
        logger.error(f"Error generating questions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/interview/evaluate-answer")
async def evaluate_answer(request: EvaluationRequest):
    """
    Evaluate an interview answer
    """
    try:
        # Get conversation
        conversation = await conversations_collection.find_one({"id": conversation_id}, {"_id": 0})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Get messages for this conversation
        messages = await messages_collection.find(
            {"conversation_id": conversation_id}, {"_id": 0}
        ).sort("created_at", 1).to_list(1000)
        
        # Build response
        conversation_obj = Conversation(**conversation)
        conversation_obj.messages = [Message(**msg) for msg in messages]
        
        return conversation_obj
        
    except HTTPException:
        raise
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
        # Get conversation to check if it exists
        conversation = await conversations_collection.find_one({"id": chat_request.conversation_id}, {"_id": 0})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Create user message
        user_message = Message(
            conversation_id=chat_request.conversation_id,
            role="user",
            content=chat_request.message
        )
        
        # Save user message
        await messages_collection.insert_one(user_message.dict())
        
        # Update conversation title if it's the first message
        message_count = await messages_collection.count_documents(
            {"conversation_id": chat_request.conversation_id}
        )
        
        if message_count == 1:
            # Use first 50 characters of first message as title
            title = chat_request.message[:50]
            await conversations_collection.update_one(
                {"id": chat_request.conversation_id},
                {"$set": {"title": title, "updated_at": datetime.now(timezone.utc)}}
            )
        else:
            # Just update the timestamp
            await conversations_collection.update_one(
                {"id": chat_request.conversation_id},
                {"$set": {"updated_at": datetime.now(timezone.utc)}}
            )
        
        # Get AI response
        ai_response_text = await ai_service.get_response(
            message=chat_request.message,
            conversation_id=chat_request.conversation_id
        )
        
        # Create assistant message
        assistant_message = Message(
            conversation_id=chat_request.conversation_id,
            role="assistant",
            content=ai_response_text
        )
        
        # Save assistant message
        await messages_collection.insert_one(assistant_message.dict())
        
        logger.info(f"Chat completed for conversation {chat_request.conversation_id}")
        
        return ChatResponse(
            user_message=user_message,
            assistant_message=assistant_message
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
