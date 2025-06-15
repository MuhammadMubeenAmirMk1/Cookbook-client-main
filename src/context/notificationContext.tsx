import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from 'react';

interface NotificationType {
  type: string;
  content: string;
}

interface NotificationContextType {
  notifications: NotificationType[];
  addNotification: (type: string, content: string) => void;
  removeNotification: (index: number) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const useNotificationContext = (): NotificationContextType => {
  return useContext(NotificationContext);
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps): JSX.Element => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (type: string, content: string): void => {
    setNotifications([...notifications, { type, content }]);
  };

  const removeNotification = (index: number): void => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
