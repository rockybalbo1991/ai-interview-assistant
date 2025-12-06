import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import StealthScreen from './components/StealthScreen';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStealth, setIsStealth] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Toggle stealth mode with Ctrl + Shift + H
      if (event.ctrlKey && event.shiftKey && (event.key === 'h' || event.key === 'H')) {
        event.preventDefault();
        setIsStealth((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isStealth) {
      document.title = 'Notes';
    } else {
      document.title = 'Notes';
    }
  }, [isStealth]);

  const loadConversations = async () => {
    try {
      const response = await axios.get(`${API}/conversations`);
      const loadedConversations = response.data.map((conv, index) => ({
        id: conv.id,
        title: conv.title || `Note ${index + 1}`,
        timestamp: new Date(conv.timestamp),
        messages: []
      }));
      setConversations(loadedConversations);
      if (loadedConversations.length > 0) {
        setCurrentConversationId(loadedConversations[0].id);
        await loadConversationMessages(loadedConversations[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onStartPractice={(role) => {
              setSelectedRole(role);
              setCurrentPage('practice');
            }}
            onStartMock={(role) => {
              setSelectedRole(role);
              setCurrentPage('mock');
            }}
            onViewTips={() => setCurrentPage('tips')}
          />
        );
      case 'practice':
        return (
          <Practice
            role={selectedRole}
            onBack={() => setCurrentPage('home')}
            onComplete={(data) => {
              setInterviewData(data);
              setCurrentPage('results');
            }}
          />
        );
      case 'mock':
        return (
          <MockInterview
            role={selectedRole}
            onBack={() => setCurrentPage('home')}
            onComplete={(data) => {
              setInterviewData(data);
              setCurrentPage('results');
            }}
          />
        );
      case 'results':
        return (
          <Results
            data={interviewData}
            onBackHome={() => setCurrentPage('home')}
          />
        );
      case 'tips':
        return <Tips onBack={() => setCurrentPage('home')} />;
      default:
        return <Home onStartPractice={() => setCurrentPage('practice')} />;
    }
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const handleNewChat = async () => {
    try {
      const response = await axios.post(`${API}/conversations`, {
        title: 'New note'
      });
      
      const newConversation = {
        id: response.data.id,
        title: response.data.title || 'New note',
        timestamp: new Date(response.data.created_at),
        messages: []
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSelectConversation = async (id) => {
    setCurrentConversationId(id);
    const conversation = conversations.find(c => c.id === id);
    if (conversation && conversation.messages.length === 0) {
      await loadConversationMessages(id);
    }
  };

  const handleDeleteConversation = async (id) => {
    try {
      await axios.delete(`${API}/conversations/${id}`);
      
      const filtered = conversations.filter(c => c.id !== id);
      setConversations(filtered);
      
      if (currentConversationId === id) {
        setCurrentConversationId(filtered.length > 0 ? filtered[0].id : null);
        if (filtered.length > 0) {
          await loadConversationMessages(filtered[0].id);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleSendMessage = async (message) => {
    if (!currentConversationId) return;
    
    try {
      const response = await axios.post(`${API}/chat`, {
        conversation_id: currentConversationId,
        message: message
      });
      
      // Update conversation with both messages
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          const newMessages = [...conv.messages, response.data.user_message, response.data.assistant_message];
          return {
            ...conv,
            messages: newMessages,
            title: conv.messages.length === 0 ? (conv.title || message.substring(0, 50)) : conv.title
          };
        }
        return conv;
      }));
      
      // Reload conversations to update titles and timestamps
      await loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#212121] text-white items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (isStealth) {
    return <StealthScreen />;
  }

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
      />
      <ChatInterface
        conversation={currentConversation}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default App;
