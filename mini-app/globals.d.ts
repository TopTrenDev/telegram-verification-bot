declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          id?: number;
          first_name?: string;
          last_name?: string;
          username?: string;
          [key: string]: any;
        };
        ready: () => void;
        close: () => void;
        sendData: (data: string) => void;
      };
    };
  }
}
