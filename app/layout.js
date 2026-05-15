"use client";
import { Provider } from "react-redux";
import "./globals.css";
import { store } from "@/redux/store";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./providers/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <Provider store={store}>
          <AuthProvider>
            {children}

          </AuthProvider>
          <Toaster position="top-right" />
        </Provider>
      </body>
    </html>
  );
}