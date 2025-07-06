import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { Message } from '../../types/chat';
import { selectChatMessages } from '../../store/chat/chatSelectors';
import { initiateChatConnection, terminateChatConnection, postChatMessage } from '../../store/chat/chatActions';
import ChatView from './ChatView';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  conversationId: string;
  onNewMessage?: (message: Message) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId, onNewMessage }) => {
  const messages = useSelector(selectChatMessages);
  const isConnected = useSelector((state: RootState) => state.chat.isConnected);
  const isTyping = useSelector((state: RootState) => state.chat.isTyping);
  const dispatch = useDispatch<AppDispatch>();
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    dispatch(initiateChatConnection(backendUrl, toast));

    return () => {
      dispatch(terminateChatConnection());
    };
  }, [dispatch, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isConnected) {
        console.log("Send message prevented: ", {
            inputValueEmpty: !inputValue.trim(),
            notConnected: !isConnected
        });
        return;
    }

    // Dispatch the sendMessage thunk
    dispatch(postChatMessage(inputValue, conversationId, toast));

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ChatView
      messages={messages}
      isConnected={isConnected}
      isTyping={isTyping}
      inputValue={inputValue}
      setInputValue={setInputValue}
      handleSendMessage={handleSendMessage}
      handleKeyPress={handleKeyPress}
      messagesEndRef={messagesEndRef}
    />
  );
};

export default ChatInterface;

