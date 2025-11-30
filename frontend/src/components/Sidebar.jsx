import React from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const Sidebar = ({ conversations, currentConversationId, onSelectConversation, onNewChat, onDeleteConversation }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const groupedConversations = conversations.reduce((groups, conv) => {
    const dateLabel = formatDate(conv.timestamp);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(conv);
    return groups;
  }, {});

  return (
    <div className="w-64 bg-[#171717] border-r border-gray-800 flex flex-col h-screen">
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className="w-full bg-transparent border border-gray-700 hover:bg-gray-800 text-white flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        {Object.entries(groupedConversations).map(([dateLabel, convs]) => (
          <div key={dateLabel} className="mb-4">
            <div className="text-xs text-gray-500 px-3 py-2 font-medium">{dateLabel}</div>
            {convs.map((conv) => (
              <div
                key={conv.id}
                className={`group relative flex items-center gap-2 px-3 py-2 mb-1 rounded-lg cursor-pointer transition-all ${
                  currentConversationId === conv.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800/50'
                }`}
                onClick={() => onSelectConversation(conv.id)}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate flex-1">{conv.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700 rounded"
                >
                  <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          ManuGPT - Free Version
        </div>
      </div>
    </div>
  );
};

export default Sidebar;