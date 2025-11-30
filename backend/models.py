from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
import uuid

class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    role: str  # 'user' or 'assistant'
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MessageCreate(BaseModel):
    role: str
    content: str

class Conversation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = "New note"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    messages: List[Message] = []

class ConversationCreate(BaseModel):
    title: Optional[str] = "New note"

class ConversationSummary(BaseModel):
    id: str
    title: str
    timestamp: datetime

class ChatRequest(BaseModel):
    conversation_id: str
    message: str

class ChatResponse(BaseModel):
    user_message: Message
    assistant_message: Message
