import { App } from "../App";

export default function Hello({ path, routeData }) {
  return (
    <App title="Hello">
      <div>
        <>
          {routeData?.msg} {path}!
        </>
      </div>
    </App>
  );
}
