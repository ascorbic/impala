import { App } from "../App";

export default function Hello({ url }: { url: string }) {
  return (
    <App title="Home">
      <div>Home {url}!</div>
    </App>
  );
}
