import React, { useEffect } from 'react';
import { useNotificationContext } from '../../context/notificationContext';

interface NotificationProps {
  type: string;
  content: string;
  index: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  content,
  index,
}) => {
  const { removeNotification } = useNotificationContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(index);
    }, 5000); // Auto-remove the notification after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [index, removeNotification]);

  const getBackgroundColor = (): string => {
    switch (type) {
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`p-3 my-3 flex justify-between text-white ${getBackgroundColor()} rounded-md`}
    >
      {content}
      <button
        className="ml-2 text-white font-bold underline underline-offset-3"
        onClick={() => {
          removeNotification(index);
        }}
      >
        Close
      </button>
    </div>
  );
};

export default Notification;
