import React from "react";
import "./App.css";
import { Head } from "@impalajs/react/head";

interface AppProps {
  title: string;
}

export const App: React.FC<React.PropsWithChildren<AppProps>> = ({
  children,
  title,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="This is a demo" />
      </Head>
      {children}
    </>
  );
};
