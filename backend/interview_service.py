import os
from emergentintegrations.llm.chat import LlmChat, UserMessage
from dotenv import load_dotenv
import logging
import json
import uuid

logger = logging.getLogger(__name__)
load_dotenv()

class InterviewService:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment variables")
        logger.info("Interview Service initialized with Emergent LLM Key")
    
    async def generate_questions(self, role: str, count: int = 5, difficulty: str = 'mixed') -> list:
        """
        Generate interview questions for a specific role
        """
        try:
            session_id = f"question_gen_{uuid.uuid4()}"
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message="You are an expert technical interviewer. Generate relevant, thoughtful interview questions."
            )
            chat.with_model("openai", "gpt-4o-mini")
            
            prompt = f"""Generate {count} interview questions for a {role} position.
            Difficulty level: {difficulty}
            
            Return ONLY a JSON array with this exact format:
            [
              {{
                "text": "question text",
                "difficulty": "Easy/Medium/Hard",
                "context": "brief context if needed"
              }}
            ]
            
            Make questions relevant, practical, and varied in difficulty."""
            
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Parse JSON from response
            try:
                # Extract JSON from response (handle markdown code blocks)
                response_text = response.strip()
                if '```json' in response_text:
                    response_text = response_text.split('```json')[1].split('```')[0].strip()
                elif '```' in response_text:
                    response_text = response_text.split('```')[1].split('```')[0].strip()
                
                questions = json.loads(response_text)
                logger.info(f"Generated {len(questions)} questions for {role}")
                return questions
            except json.JSONDecodeError:
                # Fallback: create basic questions
                logger.warning("Failed to parse JSON, using fallback questions")
                return self._get_fallback_questions(role, count)
            
        except Exception as e:
            logger.error(f"Error generating questions: {str(e)}")
            return self._get_fallback_questions(role, count)
    
    async def evaluate_answer(self, question: dict, answer: str, role: str) -> dict:
        """
        Evaluate an interview answer
        """
        try:
            session_id = f"eval_{uuid.uuid4()}"
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message="You are an expert interview evaluator. Provide constructive, specific feedback."
            )
            chat.with_model("openai", "gpt-4o-mini")
            
            question_text = question.get('text', question) if isinstance(question, dict) else question
            
            prompt = f"""Evaluate this interview answer for a {role} position.
            
            Question: {question_text}
            Answer: {answer}
            
            Provide evaluation in this JSON format:
            {{
              "score": 0-10,
              "feedback": "detailed feedback",
              "strengths": ["strength 1", "strength 2"],
              "improvements": ["improvement 1", "improvement 2"]
            }}
            
            Be specific, constructive, and encouraging."""
            
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Parse JSON from response
            try:
                response_text = response.strip()
                if '```json' in response_text:
                    response_text = response_text.split('```json')[1].split('```')[0].strip()
                elif '```' in response_text:
                    response_text = response_text.split('```')[1].split('```')[0].strip()
                
                evaluation = json.loads(response_text)
                logger.info(f"Evaluated answer with score: {evaluation.get('score', 0)}")
                return evaluation
            except json.JSONDecodeError:
                logger.warning("Failed to parse evaluation JSON")
                return {
                    "score": 7,
                    "feedback": "Your answer demonstrates understanding. Keep practicing!",
                    "strengths": ["Clear communication"],
                    "improvements": ["Add more specific examples"]
                }
            
        except Exception as e:
            logger.error(f"Error evaluating answer: {str(e)}")
            raise Exception(f"Failed to evaluate answer: {str(e)}")
    
    async def start_mock_interview(self, role: str) -> dict:
        """
        Start a mock interview session
        """
        try:
            session_id = f"mock_{uuid.uuid4()}"
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=f"You are conducting a professional interview for a {role} position. Be conversational, ask relevant questions, and provide feedback."
            )
            chat.with_model("openai", "gpt-4o-mini")
            
            greeting = f"Hello! Thank you for joining us today. I'm excited to learn more about your background and experience for the {role} position. Let's begin with our first question."
            
            first_question = f"Can you tell me about yourself and why you're interested in this {role} position?"
            
            return {
                "session_id": session_id,
                "greeting": greeting,
                "first_question": first_question
            }
            
        except Exception as e:
            logger.error(f"Error starting mock interview: {str(e)}")
            raise Exception(f"Failed to start mock interview: {str(e)}")
    
    async def continue_mock_interview(self, session_id: str, answer: str, role: str, question_count: int = 0) -> dict:
        """
        Continue mock interview with next question
        """
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=f"You are conducting a professional interview for a {role} position."
            )
            chat.with_model("openai", "gpt-4o-mini")
            
            # Check if we should end the interview (after 5 questions)
            if question_count >= 4:
                return {
                    "is_complete": True,
                    "closing_message": "Thank you for your time today. You've provided great answers. We'll be in touch soon regarding next steps. Best of luck!"
                }
            
            prompt = f"""Based on the candidate's previous answer: "{answer}"
            
            1. Provide brief feedback (1-2 sentences)
            2. Ask the next relevant interview question for a {role}
            
            Format your response as:
            FEEDBACK: [your feedback]
            QUESTION: [next question]"""
            
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Parse response
            parts = response.split('QUESTION:')
            feedback = parts[0].replace('FEEDBACK:', '').strip()
            next_question = parts[1].strip() if len(parts) > 1 else "Can you tell me about a challenging project you've worked on?"
            
            return {
                "is_complete": False,
                "feedback": feedback,
                "next_question": next_question
            }
            
        except Exception as e:
            logger.error(f"Error continuing mock interview: {str(e)}")
            raise Exception(f"Failed to continue mock interview: {str(e)}")
    
    def _get_fallback_questions(self, role: str, count: int) -> list:
        """Fallback questions if AI generation fails"""
        base_questions = [
            {"text": f"Tell me about your experience in {role}.", "difficulty": "Easy"},
            {"text": "What are your greatest strengths and weaknesses?", "difficulty": "Medium"},
            {"text": "Describe a challenging project you've worked on.", "difficulty": "Medium"},
            {"text": "How do you stay updated with industry trends?", "difficulty": "Easy"},
            {"text": "Where do you see yourself in 5 years?", "difficulty": "Easy"},
        ]
        return base_questions[:count]

# Singleton instance
interview_service = InterviewService()