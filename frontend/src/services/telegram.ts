// services/telegram.ts

declare global {
  interface Window {
    Telegram?: any;
  }
}

// Mocking the Telegram WebApp object for browser development
const isBrowser = typeof window !== 'undefined' && !window.Telegram?.WebApp?.initData;

export const tg = window.Telegram?.WebApp || {
  initData: '',
  initDataUnsafe: { user: { id: 12345, first_name: 'Test User' } },
  BackButton: { show: () => {}, hide: () => {}, onClick: (cb?: any) => {} },
  MainButton: { show: () => {}, hide: () => {}, setText: (text?: string) => {}, onClick: (cb?: any) => {}, showProgress: (leaveActive?: boolean) => {}, hideProgress: () => {} },
  HapticFeedback: { 
    impactOccurred: (style: string) => console.log('Haptic:', style),
    notificationOccurred: (type: string) => console.log('Haptic Notification:', type)
  },
  themeParams: {},
  ready: () => {},
  expand: () => {},
  close: () => {},
};

export const useHaptic = () => {
  const impact = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    tg.HapticFeedback.impactOccurred(style);
  };

  const notification = (type: 'error' | 'success' | 'warning') => {
    tg.HapticFeedback.notificationOccurred(type);
  };

  return { impact, notification };
};
