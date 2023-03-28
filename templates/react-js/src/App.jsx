import React from "react";
import "./App.css";
import { Head } from "@impalajs/react/head";

export const App = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </>
  );
};
