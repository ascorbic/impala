import type { StaticRouteProps } from "@impalajs/core";
import { useState } from "preact/hooks";
import { App } from "../App";
import logo from "../assets/impala.png";
import "./index.css";

export default function Hello({ path }: StaticRouteProps) {
  const [count, setCount] = useState(0);

  return (
    <App title="Home">
      <div className="App">
        <div>
          <img src={logo} alt="Impala Logo" className="logo" />
        </div>
        <h1>Impala</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/routes/index.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </App>
  );
}
