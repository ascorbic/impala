import type { StaticRouteProps } from "@impalajs/core";
import { useState } from "react";
import { App } from "../App";

export default function Hello({ path }: StaticRouteProps) {
  const [count, setCount] = useState(0);

  return (
    <App title="Home">
      <div>Home {path}!</div>
      <div>
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      </div>
    </App>
  );
}
