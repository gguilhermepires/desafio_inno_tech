import React from 'react';
import { MessageSquare, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { Conversation } from '../../types/chat';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}) => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4">
        <Link to="/">
          <Button
            className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            variant="outline"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>

      <Separator className="bg-gray-700" />

      {/* Conversations List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {conversations.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          )}
          
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeConversationId === conversation.id
                  ? 'bg-gray-700'
                  : 'hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <MessageSquare className="h-4 w-4 mt-1 flex-shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {conversation.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {conversation.lastContent}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(conversation.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          Chat Assistant v1.0
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
