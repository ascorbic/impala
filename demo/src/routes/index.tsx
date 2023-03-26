import { useState } from "react";
import { App } from "../App";

export default function Hello({ url }: { url: string }) {
  const [count, setCount] = useState(0);

  return (
    <App title="Home">
      <div>Home {url}!</div>
      <div>
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      </div>
    </App>
  );
}
