#!/usr/bin/env python3
"""
ManuGPT Backend API Testing Suite
Tests all backend endpoints thoroughly with real scenarios
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime
from typing import Dict, Any, List

# Get backend URL from frontend .env file
BACKEND_URL = "https://mgpt-assistant.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.session = None
        self.test_results = []
        self.conversations_created = []
        
    async def setup(self):
        """Setup test session"""
        self.session = aiohttp.ClientSession()
        
    async def cleanup(self):
        """Cleanup test session and data"""
        # Clean up test conversations
        for conv_id in self.conversations_created:
            try:
                await self.delete_conversation(conv_id, cleanup=True)
            except:
                pass
                
        if self.session:
            await self.session.close()
    
    def log_result(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
    
    async def test_health_check(self):
        """Test GET /api/ - Health check endpoint"""
        try:
            async with self.session.get(f"{BACKEND_URL}/") as response:
                if response.status == 200:
                    data = await response.json()
                    if "message" in data and "ManuGPT API is running" in data["message"]:
                        self.log_result("Health Check", True, "API is running correctly")
                        return True
                    else:
                        self.log_result("Health Check", False, f"Unexpected response format", data)
                        return False
                else:
                    text = await response.text()
                    self.log_result("Health Check", False, f"Status {response.status}", text)
                    return False
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    async def create_conversation(self, title: str = "Test Conversation") -> str:
        """Test POST /api/conversations - Create new conversation"""
        try:
            payload = {"title": title}
            async with self.session.post(
                f"{BACKEND_URL}/conversations",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    if "id" in data and "title" in data:
                        conv_id = data["id"]
                        self.conversations_created.append(conv_id)
                        self.log_result("Create Conversation", True, f"Created conversation with ID: {conv_id}")
                        return conv_id
                    else:
                        self.log_result("Create Conversation", False, "Missing required fields in response", data)
                        return None
                else:
                    text = await response.text()
                    self.log_result("Create Conversation", False, f"Status {response.status}", text)
                    return None
        except Exception as e:
            self.log_result("Create Conversation", False, f"Error: {str(e)}")
            return None
    
    async def send_chat_message(self, conversation_id: str, message: str) -> Dict[str, Any]:
        """Test POST /api/chat - Send message and get AI response"""
        try:
            payload = {
                "conversation_id": conversation_id,
                "message": message
            }
            async with self.session.post(
                f"{BACKEND_URL}/chat",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    if ("user_message" in data and "assistant_message" in data and 
                        data["user_message"]["content"] == message and
                        data["assistant_message"]["content"]):
                        self.log_result("Send Chat Message", True, 
                                      f"AI responded with {len(data['assistant_message']['content'])} characters")
                        return data
                    else:
                        self.log_result("Send Chat Message", False, "Invalid response structure", data)
                        return None
                else:
                    text = await response.text()
                    self.log_result("Send Chat Message", False, f"Status {response.status}", text)
                    return None
        except Exception as e:
            self.log_result("Send Chat Message", False, f"Error: {str(e)}")
            return None
    
    async def get_conversation(self, conversation_id: str) -> Dict[str, Any]:
        """Test GET /api/conversations/:id - Get specific conversation with messages"""
        try:
            async with self.session.get(f"{BACKEND_URL}/conversations/{conversation_id}") as response:
                if response.status == 200:
                    data = await response.json()
                    if "id" in data and "messages" in data:
                        self.log_result("Get Conversation", True, 
                                      f"Retrieved conversation with {len(data['messages'])} messages")
                        return data
                    else:
                        self.log_result("Get Conversation", False, "Missing required fields", data)
                        return None
                else:
                    text = await response.text()
                    self.log_result("Get Conversation", False, f"Status {response.status}", text)
                    return None
        except Exception as e:
            self.log_result("Get Conversation", False, f"Error: {str(e)}")
            return None
    
    async def get_all_conversations(self) -> List[Dict[str, Any]]:
        """Test GET /api/conversations - List all conversations"""
        try:
            async with self.session.get(f"{BACKEND_URL}/conversations") as response:
                if response.status == 200:
                    data = await response.json()
                    if isinstance(data, list):
                        self.log_result("Get All Conversations", True, f"Retrieved {len(data)} conversations")
                        return data
                    else:
                        self.log_result("Get All Conversations", False, "Response is not a list", data)
                        return None
                else:
                    text = await response.text()
                    self.log_result("Get All Conversations", False, f"Status {response.status}", text)
                    return None
        except Exception as e:
            self.log_result("Get All Conversations", False, f"Error: {str(e)}")
            return None
    
    async def delete_conversation(self, conversation_id: str, cleanup: bool = False) -> bool:
        """Test DELETE /api/conversations/:id - Delete conversation"""
        try:
            async with self.session.delete(f"{BACKEND_URL}/conversations/{conversation_id}") as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get("success"):
                        if not cleanup:
                            self.log_result("Delete Conversation", True, f"Successfully deleted conversation {conversation_id}")
                        return True
                    else:
                        if not cleanup:
                            self.log_result("Delete Conversation", False, "Success field not true", data)
                        return False
                else:
                    text = await response.text()
                    if not cleanup:
                        self.log_result("Delete Conversation", False, f"Status {response.status}", text)
                    return False
        except Exception as e:
            if not cleanup:
                self.log_result("Delete Conversation", False, f"Error: {str(e)}")
            return False
    
    async def test_invalid_conversation_id(self):
        """Test error handling for invalid conversation IDs"""
        invalid_id = "invalid-conversation-id-12345"
        
        # Test getting invalid conversation
        try:
            async with self.session.get(f"{BACKEND_URL}/conversations/{invalid_id}") as response:
                if response.status == 404:
                    self.log_result("Invalid Conversation ID (GET)", True, "Correctly returned 404 for invalid ID")
                else:
                    text = await response.text()
                    self.log_result("Invalid Conversation ID (GET)", False, f"Expected 404, got {response.status}", text)
        except Exception as e:
            self.log_result("Invalid Conversation ID (GET)", False, f"Error: {str(e)}")
        
        # Test deleting invalid conversation
        try:
            async with self.session.delete(f"{BACKEND_URL}/conversations/{invalid_id}") as response:
                if response.status == 404:
                    self.log_result("Invalid Conversation ID (DELETE)", True, "Correctly returned 404 for invalid ID")
                else:
                    text = await response.text()
                    self.log_result("Invalid Conversation ID (DELETE)", False, f"Expected 404, got {response.status}", text)
        except Exception as e:
            self.log_result("Invalid Conversation ID (DELETE)", False, f"Error: {str(e)}")
        
        # Test sending message to invalid conversation
        try:
            payload = {"conversation_id": invalid_id, "message": "Test message"}
            async with self.session.post(
                f"{BACKEND_URL}/chat",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 404:
                    self.log_result("Invalid Conversation ID (CHAT)", True, "Correctly returned 404 for invalid ID")
                else:
                    text = await response.text()
                    self.log_result("Invalid Conversation ID (CHAT)", False, f"Expected 404, got {response.status}", text)
        except Exception as e:
            self.log_result("Invalid Conversation ID (CHAT)", False, f"Error: {str(e)}")
    
    async def run_comprehensive_test(self):
        """Run all tests in the specified order"""
        print("🚀 Starting ManuGPT Backend API Tests")
        print("=" * 50)
        
        await self.setup()
        
        try:
            # 1. Health check
            health_ok = await self.test_health_check()
            if not health_ok:
                print("❌ Health check failed - stopping tests")
                return
            
            # 2. Create first conversation
            conv1_id = await self.create_conversation("Python Discussion")
            if not conv1_id:
                print("❌ Failed to create first conversation - stopping tests")
                return
            
            # 3. Send test message asking "What is Python?"
            chat_response = await self.send_chat_message(conv1_id, "What is Python?")
            if not chat_response:
                print("❌ Failed to send chat message - stopping tests")
                return
            
            # 4. Verify conversation title is updated and retrieve conversation
            conversation_data = await self.get_conversation(conv1_id)
            if conversation_data:
                # Check if title was updated with first message
                if conversation_data["title"] == "What is Python?":
                    self.log_result("Title Update", True, "Conversation title updated with first message")
                else:
                    self.log_result("Title Update", False, f"Title not updated correctly: {conversation_data['title']}")
                
                # Check if messages are stored correctly
                messages = conversation_data["messages"]
                if len(messages) >= 2:
                    user_msg = next((m for m in messages if m["role"] == "user"), None)
                    ai_msg = next((m for m in messages if m["role"] == "assistant"), None)
                    
                    if user_msg and ai_msg and user_msg["content"] == "What is Python?":
                        self.log_result("Message Storage", True, "Messages stored correctly in conversation")
                    else:
                        self.log_result("Message Storage", False, "Messages not stored correctly")
                else:
                    self.log_result("Message Storage", False, f"Expected 2+ messages, got {len(messages)}")
            
            # 5. Create second conversation
            conv2_id = await self.create_conversation("JavaScript Discussion")
            if conv2_id:
                # Send message to second conversation
                await self.send_chat_message(conv2_id, "Explain JavaScript closures")
            
            # 6. List all conversations and verify both are returned
            all_conversations = await self.get_all_conversations()
            if all_conversations is not None:
                conv_ids = [conv["id"] for conv in all_conversations]
                if conv1_id in conv_ids and conv2_id in conv_ids:
                    self.log_result("List Conversations", True, f"Both conversations found in list of {len(all_conversations)}")
                else:
                    self.log_result("List Conversations", False, "Not all created conversations found in list")
            
            # 7. Delete first conversation and verify it's removed
            if await self.delete_conversation(conv1_id):
                # Remove from our tracking list since we successfully deleted it
                if conv1_id in self.conversations_created:
                    self.conversations_created.remove(conv1_id)
                
                # Verify it's actually deleted by trying to get it (should return 404)
                try:
                    async with self.session.get(f"{BACKEND_URL}/conversations/{conv1_id}") as response:
                        if response.status == 404:
                            self.log_result("Verify Deletion", True, "Conversation successfully deleted and returns 404")
                        else:
                            self.log_result("Verify Deletion", False, f"Expected 404, got {response.status}")
                except Exception as e:
                    self.log_result("Verify Deletion", False, f"Error verifying deletion: {str(e)}")
            
            # 8. Test error handling for invalid conversation IDs
            await self.test_invalid_conversation_id()
            
        finally:
            await self.cleanup()
        
        # Print summary
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        return passed == total

async def main():
    """Main test runner"""
    tester = BackendTester()
    success = await tester.run_comprehensive_test()
    
    if success:
        print("\n🎉 All tests passed! ManuGPT backend is working correctly.")
        return 0
    else:
        print("\n💥 Some tests failed. Check the details above.")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)