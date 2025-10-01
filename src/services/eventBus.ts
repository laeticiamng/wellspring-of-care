import type { AppEvent } from '@/types/assessment';

export const EventBus = {
  emit(event: AppEvent): void {
    window.dispatchEvent(
      new CustomEvent(event.type, {
        detail: event.payload,
      })
    );
    console.log('[EventBus]', event.type, event.payload);
  },

  on<T = any>(type: AppEvent['type'], callback: (payload: T) => void): () => void {
    const handler = (ev: Event) => {
      const customEvent = ev as CustomEvent<T>;
      callback(customEvent.detail);
    };

    window.addEventListener(type, handler);

    return () => {
      window.removeEventListener(type, handler);
    };
  },

  once<T = any>(type: AppEvent['type'], callback: (payload: T) => void): void {
    const handler = (ev: Event) => {
      const customEvent = ev as CustomEvent<T>;
      callback(customEvent.detail);
      window.removeEventListener(type, handler);
    };

    window.addEventListener(type, handler);
  },
};
