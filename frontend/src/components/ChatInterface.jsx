import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import Logo from './Logo';

const ChatInterface = ({ conversation, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    setIsLoading(true);

    // Auto-resize textarea back to normal
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await onSendMessage(message);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#212121]">
      {!conversation || conversation.messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-3xl font-semibold text-white mb-2">ManuGPT</h1>
            <p className="text-gray-400">How can I help you today?</p>
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {conversation.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="w-full py-6 bg-[#2C2C2C]">
              <div className="max-w-3xl mx-auto px-4 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-gray-900">
                    MGPT
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-gray-800 bg-[#212121] p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-[#2C2C2C] rounded-xl border border-gray-700 focus-within:border-gray-600 transition-colors p-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Message ManuGPT..."
              className="flex-1 bg-transparent border-0 text-white placeholder-gray-500 resize-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[24px] max-h-[200px]"
              style={{ height: 'auto' }}
              rows={1}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-white hover:bg-gray-200 text-gray-900 rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            ManuGPT can make mistakes. Check important info.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
