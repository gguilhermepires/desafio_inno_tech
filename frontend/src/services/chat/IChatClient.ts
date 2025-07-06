import { AppDispatch, RootState } from "../../store";
import { Message } from "../../types/chat";
import { ToastFunction } from "../../types/utils";

export interface IChatClient {
  connect(backendUrl: string, toast: ToastFunction, dispatch: AppDispatch): void;
  disconnect(dispatch: AppDispatch): void;
  sendMessage(message: string, conversationId: string, state: RootState, dispatch: AppDispatch, toast: ToastFunction): void;
} 