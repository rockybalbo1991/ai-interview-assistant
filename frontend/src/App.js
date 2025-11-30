import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { getMockConversations, saveMockConversation, deleteMockConversation } from './mock/mockData';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  useEffect(() => {
    const loadedConversations = getMockConversations();
    setConversations(loadedConversations);
    if (loadedConversations.length > 0) {
      setCurrentConversationId(loadedConversations[0].id);
    }
  }, []);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const handleNewChat = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New chat',
      timestamp: new Date(),
      messages: []
    };
    
    const updated = [newConversation, ...conversations];
    setConversations(updated);
    setCurrentConversationId(newConversation.id);
    localStorage.setItem('manugpt_conversations', JSON.stringify(updated));
  };

  const handleSelectConversation = (id) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id) => {
    const filtered = deleteMockConversation(id);
    setConversations(filtered);
    
    if (currentConversationId === id) {
      setCurrentConversationId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const handleSendMessage = async (message) => {
    // Add user message
    const userMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    // Update conversation with user message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [...conv.messages, userMessage];
        return {
          ...conv,
          messages: updatedMessages,
          title: conv.messages.length === 0 ? message.substring(0, 50) : conv.title
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    localStorage.setItem('manugpt_conversations', JSON.stringify(updatedConversations));

    // Simulate AI response (will be replaced with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiMessage = {
      id: `m${Date.now() + 1}`,
      role: 'assistant',
      content: `This is a mock response. The actual AI integration will be added in the backend. You asked: "${message}"`,
      timestamp: new Date()
    };

    const finalConversations = updatedConversations.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, aiMessage]
        };
      }
      return conv;
    });

    setConversations(finalConversations);
    localStorage.setItem('manugpt_conversations', JSON.stringify(finalConversations));
  };

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