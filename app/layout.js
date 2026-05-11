"use client";
import { Provider } from "react-redux";
import "./globals.css";
import { store } from "@/redux/store";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Provider store={store}>
        {children}

        </Provider>
      </body>
    </html>
  );
}