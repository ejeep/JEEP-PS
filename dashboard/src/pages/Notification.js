import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationDots, setNotificationDots] = useState({
    driver: false,
    otherPage: false, // Add other pages as needed
  });

  return (
    <NotificationContext.Provider value={{ notificationDots, setNotificationDots }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
