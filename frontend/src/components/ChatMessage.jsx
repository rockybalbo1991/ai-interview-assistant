import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';

  return (
    <div className={`w-full py-6 ${
      isUser ? 'bg-[#212121]' : 'bg-[#212121]'
    }`}>
      <div className="max-w-3xl mx-auto px-4 flex gap-4">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm font-bold ${
            isUser 
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' 
              : 'bg-gradient-to-br from-emerald-400 to-cyan-400 text-gray-900'
          }`}>
            {isUser ? 'Me' : 'AI'}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {isUser ? (
            <div className="text-white whitespace-pre-wrap break-words">{message.content}</div>
          ) : (
            <div className="text-gray-200 prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="relative group my-4">
                        <div className="absolute right-2 top-2 z-10">
                          <button
                            onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                          >
                            {copied ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-300" />
                            )}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            fontSize: '0.875rem'
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
