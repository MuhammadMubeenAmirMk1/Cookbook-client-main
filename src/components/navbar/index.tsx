import React from 'react';
import CookbookIcon from '../../svg/cookbookIcon';
import { Outlet } from 'react-router-dom';
import getUserFromLocalStorage from '../../utils/getUserFromLocalStorage';
import { useNotificationContext } from '../../context/notificationContext';
import Notification from '../notification';

const Navbar = (): JSX.Element => {
  const user = getUserFromLocalStorage();
  const { notifications } = useNotificationContext();

  const logout = (): void => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  console.log('the notifications are', notifications);

  return (
    <>
      <header className="header sticky dark:bg-sky-600 text-white top-0 shadow-md flex items-center justify-between px-8 py-4">
        <h1 className="text-2xl">
          <a className="flex justify-center items-center" href="">
            <CookbookIcon className="w-8 h-8 mr-2" />
            Cookbook
          </a>
        </h1>
        <div className="ml-auto">
          {user && (
            <button
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>
      </header>
      <div className="dark:bg-gray-900 p-3">
        {notifications.map((notification, index) => (
          <Notification
            key={index}
            type={notification.type}
            content={notification.content}
            index={index}
          />
        ))}
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;
