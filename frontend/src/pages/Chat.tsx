
import React, { useState, useCallback } from 'react';
import ChatInterface from '@/components/ChatInterface';
import ChatSidebar from '@/components/ChatSidebar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('default');

  const handleNewMessage = useCallback((message: Message) => {
    setConversations(prev => {
      const existingIndex = prev.findIndex(conv => conv.id === activeConversationId);
      
      if (existingIndex >= 0) {
        // Update existing conversation
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          lastMessage: message.text,
          timestamp: message.timestamp,
          title: updated[existingIndex].title === 'New Chat' 
            ? message.text.substring(0, 30) + (message.text.length > 30 ? '...' : '')
            : updated[existingIndex].title
        };
        return updated;
      } else {
        // Create new conversation
        const newConversation: Conversation = {
          id: activeConversationId,
          title: message.text.substring(0, 30) + (message.text.length > 30 ? '...' : ''),
          lastMessage: message.text,
          timestamp: message.timestamp,
        };
        return [...prev, newConversation];
      }
    });
  }, [activeConversationId]);

  const handleSelectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
  }, []);

  const handleNewConversation = useCallback(() => {
    const newId = `conversation-${Date.now()}`;
    setActiveConversationId(newId);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />
      <div className="flex-1">
        <ChatInterface
          conversationId={activeConversationId}
          onNewMessage={handleNewMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
