import { AppDispatch, RootState } from '../index';
import { chatService } from '../../services/chat';
import { ToastFunction } from '../../types/utils';

export const initiateChatConnection = (backendUrl: string, toast: ToastFunction) =>
  (dispatch: AppDispatch) => {
    chatService.connect(backendUrl, toast, dispatch);
  };

export const terminateChatConnection = () => (dispatch: AppDispatch) => {
  chatService.disconnect(dispatch);
};

export const postChatMessage = (message: string, conversationId: string, toast: ToastFunction) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    chatService.sendMessage(message, conversationId, state, dispatch, toast);
  }; 