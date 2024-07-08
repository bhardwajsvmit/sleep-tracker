"use client"
import { createContext, useState } from "react";
import { AppContextTypes, sleepDataType, userType } from "./types/AppContextTypes";

export const AppContext = createContext<AppContextTypes|{}>({});

export function AppContextProvider({ children }: any) {
  const [users, setUsers] = useState({});
  const [sleepData, setSleepData] = useState<sleepDataType|{}>({});
  const [loggedInUser, setLoggedInUser] = useState<userType|null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 const loggedInUserId = loggedInUser?.userId||"";
  

  const value: AppContextTypes = {
    isAuthenticated,
    setIsAuthenticated,
    users,
    setUsers,
    loggedInUser,
    setLoggedInUser,
    sleepData,
    setSleepData,
    loggedInUserId,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
