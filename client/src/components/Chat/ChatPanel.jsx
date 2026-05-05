import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '../Common/Avatar';
import { Button } from '../Common/Button';
import { Badge } from '../Common/Badge';

export const ChatPanel = ({ 
  messages = [], 
  users = [], 
  onSendMessage, 
  currentUser,
  typingUsers = {},
  onTyping // Callback for typing indicator
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Emit typing indicator via callback
    if (value && !isTyping && onTyping) {
      setIsTyping(true);
      onTyping(true);
    }

    // Clear existing timeout
    clearTimeout(typingTimeoutRef.current);
    
    // Stop typing after 1 second of no input
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (onTyping) onTyping(false);
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Send the message
    onSendMessage?.(inputValue);
    setInputValue('');
    setIsTyping(false);
    if (onTyping) onTyping(false);
  };

  // Get typing users (exclude current user)
  const typingUserList = Object.entries(typingUsers)
    .filter(([userId]) => userId !== currentUser?.uid)
    .map(([_, name]) => name);

  const isSomeoneTyping = typingUserList.length > 0;

  return (
    <div className="flex flex-col h-full bg-brand-card border-l border-brand-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-brand-border">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Collaboration Chat
          <Badge variant="success" size="xs">Live</Badge>
        </h3>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-slate-400 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            // Handle both message formats
            const messageText = message.message || message.text || '';
            const messageUserId = message.userId;
            const messageUserName = message.userName;
            const isOwn = messageUserId === currentUser?.uid;
            const user = users.find((u) => u.id === messageUserId);

            return (
              <div key={message.id || index} className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                {!isOwn && (
                  <Avatar
                    name={messageUserName || user?.name || 'Unknown'}
                    size="sm"
                    online={true}
                  />
                )}
                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                  {!isOwn && (
                    <p className="text-xs text-slate-400 px-3 py-1">
                      {messageUserName || user?.name || 'Unknown User'}
                    </p>
                  )}
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm break-words ${
                      isOwn
                        ? 'bg-gradient-purple text-white rounded-br-none'
                        : 'bg-brand-border/50 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {messageText}
                  </div>
                  <p className="text-xs text-slate-500 px-3 py-1">
                    {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : ''}
                  </p>
                </div>
                {isOwn && (
                  <div className="flex items-end pb-1">
                    <svg className="w-4 h-4 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isSomeoneTyping && (
          <div className="flex gap-2">
            <Avatar name={typingUserList[0]} size="sm" />
            <div className="flex items-center gap-1 px-3 py-2 bg-brand-border/50 rounded-lg">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="text-xs text-slate-400 ml-1">
                {typingUserList[0]}{typingUserList.length > 1 ? ` and ${typingUserList.length - 1} more` : ''} typing...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-brand-border bg-brand-dark/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!inputValue.trim()}
            icon={() => (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          />
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
