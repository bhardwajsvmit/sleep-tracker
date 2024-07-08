import { Dispatch, SetStateAction } from "react";

export type AppContextTypes = {
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isAuthenticated: boolean;
  setUsers: Dispatch<SetStateAction<Record<string, userType>>>;
  users: Record<string, userType>;
  loggedInUser: userType | null;
  setLoggedInUser: Dispatch<SetStateAction<userType | null>>;
  sleepData:sleepDataType,
  setSleepData: Dispatch<SetStateAction<sleepDataType>>
  loggedInUserId:string
};

export type userType = {
    email: string
    password: string,
    userId:string
}

export type sleepDataEntryType = {
  sleepStart: string;
  wakeUp: string;
  key: string;
};

export type sleepDataType = Record<string, sleepDataEntryType[]>;
