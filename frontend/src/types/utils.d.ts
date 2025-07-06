export interface ToastFunction {
  (options: { title: string; description: string; variant?: "default" | "destructive" }): void;
} 