import React, { useState, useCallback } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { Message, Conversation } from '../types/chat';

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
          lastContent: message.content,
          timestamp: message.timestamp,
          title: updated[existingIndex].title === 'New Chat' 
            ? message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '')
            : updated[existingIndex].title
        };
        return updated;
      } else {
        // Create new conversation
        const newConversation: Conversation = {
          id: activeConversationId,
          title: message.content.substring(0, 30) + (message.content.length > 30 ? '...' : ''),
          lastContent: message.content,
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
