import { DynamicRouteProps } from "@impalajs/core";
import { App } from "../../App";
import { Head } from "@impalajs/preact/head";

export default function Hello({
  path,
  params,
  data,
}: DynamicRouteProps<typeof import("./[id].data")>) {
  return (
    <App title={data?.title}>
      <Head>
        {/* You can also set a title tag in here if you prefer */}
        <meta name="description" content={data.description || "A page"} />
      </Head>
      <div>
        Hello {path} {params.id}!
      </div>
    </App>
  );
}
