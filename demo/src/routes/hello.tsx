import { App } from "../App";

export default function Hello({ url }: { url: string }) {
  return (
    <App title="Hello">
      <div>Hello {url}!</div>
    </App>
  );
}
