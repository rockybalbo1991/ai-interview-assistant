from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from datetime import datetime

from models import (
    Conversation, ConversationCreate, ConversationSummary,
    Message, MessageCreate, ChatRequest, ChatResponse
)
from ai_service import ai_service

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
conversations_collection = db.conversations
messages_collection = db.messages

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@api_router.get("/")
async def root():
    return {"message": "ManuGPT API is running"}

@api_router.post("/conversations", response_model=Conversation)
async def create_conversation(conversation_input: ConversationCreate):
    """
    Create a new conversation
    """
    try:
        conversation = Conversation(
            title=conversation_input.title or "New chat"
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
        conversations = await conversations_collection.find().sort("updated_at", -1).to_list(1000)
        
        # Transform to summary format
        summaries = [
            ConversationSummary(
                id=conv["id"],
                title=conv["title"],
                timestamp=conv["updated_at"]
            )
            for conv in conversations
        ]
        
        return summaries
        
    except Exception as e:
        logger.error(f"Error getting conversations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str):
    """
    Get a specific conversation with all messages
    """
    try:
        # Get conversation
        conversation = await conversations_collection.find_one({"id": conversation_id})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Get messages for this conversation
        messages = await messages_collection.find(
            {"conversation_id": conversation_id}
        ).sort("created_at", 1).to_list(1000)
        
        # Build response
        conversation_obj = Conversation(**conversation)
        conversation_obj.messages = [Message(**msg) for msg in messages]
        
        return conversation_obj
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """
    Delete a conversation and all its messages
    """
    try:
        # Delete messages first
        await messages_collection.delete_many({"conversation_id": conversation_id})
        
        # Delete conversation
        result = await conversations_collection.delete_one({"id": conversation_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        logger.info(f"Deleted conversation: {conversation_id}")
        return {"success": True}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/chat", response_model=ChatResponse)
async def chat(chat_request: ChatRequest):
    """
    Send a message and get AI response
    """
    try:
        # Get conversation to check if it exists
        conversation = await conversations_collection.find_one({"id": chat_request.conversation_id})
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
                {"$set": {"title": title, "updated_at": datetime.utcnow()}}
            )
        else:
            # Just update the timestamp
            await conversations_collection.update_one(
                {"id": chat_request.conversation_id},
                {"$set": {"updated_at": datetime.utcnow()}}
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
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
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