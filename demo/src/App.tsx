import React from "react";
import "./App.css";

interface AppProps {
  title: string;
}

export const App: React.FC<React.PropsWithChildren<AppProps>> = ({
  children,
  title,
}) => {
  return (
    <html>
      <head>
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
};
