import "./App.css";
import { Head } from "@impalajs/preact/head";

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
