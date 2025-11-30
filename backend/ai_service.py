import os
from emergentintegrations.llm.chat import LlmChat, UserMessage
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)
load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment variables")
        logger.info("AI Service initialized with Emergent LLM Key")
    
    async def get_response(self, message: str, conversation_id: str) -> str:
        """
        Get AI response for a user message
        """
        try:
            # Initialize chat with unique session ID and system message
            chat = LlmChat(
                api_key=self.api_key,
                session_id=conversation_id,
                system_message="You are ManuGPT, a helpful AI assistant. Provide clear, accurate, and helpful responses."
            )
            
            # Use default model (gpt-4o-mini as per playbook)
            chat.with_model("openai", "gpt-4o-mini")
            
            # Create user message
            user_message = UserMessage(text=message)
            
            # Get response
            response = await chat.send_message(user_message)
            
            logger.info(f"AI response generated for conversation {conversation_id}")
            return response
            
        except Exception as e:
            logger.error(f"Error getting AI response: {str(e)}")
            raise Exception(f"Failed to get AI response: {str(e)}")

# Singleton instance
ai_service = AIService()