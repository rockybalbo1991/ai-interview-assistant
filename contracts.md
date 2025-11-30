# ManuGPT API Contracts & Integration Plan

## Overview
This document outlines the backend API contracts and integration strategy for ManuGPT.

## Mocked Data (Frontend)
Currently, the frontend uses mock data stored in `mockData.js`:
- Mock conversations with sample messages
- LocalStorage for persistence
- Simulated AI responses

## Backend Implementation Plan

### 1. Database Schema (MongoDB)

**Conversations Collection:**
```javascript
{
  _id: ObjectId,
  user_id: String (optional - for future auth),
  title: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

**Messages Collection:**
```javascript
{
  _id: ObjectId,
  conversation_id: ObjectId,
  role: String ('user' | 'assistant'),
  content: String,
  created_at: DateTime
}
```

### 2. API Endpoints

**POST /api/conversations**
- Create new conversation
- Request: `{ title?: String }`
- Response: `{ id, title, created_at, messages: [] }`

**GET /api/conversations**
- List all conversations
- Response: `[{ id, title, timestamp, preview }]`

**GET /api/conversations/:id**
- Get conversation with messages
- Response: `{ id, title, timestamp, messages: [] }`

**DELETE /api/conversations/:id**
- Delete conversation
- Response: `{ success: true }`

**POST /api/chat**
- Send message and get AI response
- Request: `{ conversation_id, message }`
- Response: `{ user_message, assistant_message }`

### 3. AI Integration (emergentintegrations)
- Use `emergentintegrations` library
- Model: gpt-4o-mini (default from playbook)
- API Key: EMERGENT_LLM_KEY
- System message: "You are ManuGPT, a helpful AI assistant."

### 4. Frontend Changes
After backend is ready, replace:
- `getMockConversations()` → API call to `/api/conversations`
- `saveMockConversation()` → API call to `/api/conversations`
- `deleteMockConversation()` → API call to `/api/conversations/:id`
- Mock AI response → Real API call to `/api/chat`
- Remove mock data dependency

### 5. Integration Steps
1. Install `emergentintegrations` library in backend
2. Add EMERGENT_LLM_KEY to backend/.env
3. Create MongoDB models
4. Implement API endpoints
5. Update frontend to use real API
6. Test end-to-end flow
