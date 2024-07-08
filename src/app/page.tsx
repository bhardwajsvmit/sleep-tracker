"use client";
import { AppContext } from "@/context/AppContext";
import { AppContextTypes } from "@/context/types/AppContextTypes";
import HomePage from "@/modules/Home";
import Login from "@/modules/Login";
import { useContext } from "react";

export default function Home() {
  const { isAuthenticated } = useContext(AppContext) as AppContextTypes;
  return <main>{isAuthenticated ? <HomePage /> : <Login />}</main>;
}
