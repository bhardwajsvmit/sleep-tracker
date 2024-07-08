import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sleep tracker",
  description: "Analyse your sleep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppContextProvider>
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
        </AppContextProvider>
  );
}
