import { RootState } from '../index';
import { Message } from '../../types/chat';

export const selectChatMessages = (state: RootState): Message[] => state.chat.messages; 