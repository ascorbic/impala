// @ts-ignore
import * as ReactServerDom from "react-dom/server.browser";
// @ts-ignore
import * as ReactServerDomWebpack from "react-server-dom-webpack/server.browser";
// @ts-ignore
import * as ReactClient from "react-server-dom-webpack/client.browser";

import { ElementType } from "react";
import type { Context, RouteModule } from "@impalajs/core";
import consumers from "node:stream/consumers";
import { promises as fs } from "node:fs";
import { dirname } from "node:path";
import { join } from "node:path";

export async function render(
  context: Context,
  mod: () => Promise<RouteModule<ElementType>>,
  bootstrapModules?: Array<string>
) {
  // @ts-ignore
  const { default: bundleMapPath } = await import("virtual:client-bundle-map");
  // @ts-ignore
  const { default: serverMapPath } = await import("virtual:server-bundle-map");

  const bundleMap = JSON.parse(await fs.readFile(bundleMapPath, "utf-8"));

  const staticDir = dirname(serverMapPath);

  (globalThis as any).__webpack_require__ = async (id: string) =>
    import(join(staticDir, id));

  const { default: Page } = await mod();

  const flightStream = ReactServerDomWebpack.renderToReadableStream(
    <Page {...context} />,
    bundleMap
  );

  const fizzContent = await ReactClient.createFromReadableStream(
    flightStream,
    bundleMap
  );
  const stream = await ReactServerDom.renderToReadableStream(fizzContent, {
    bootstrapModules,
    bootstrapScriptContent: `window.___CONTEXT=${JSON.stringify(context)};`,
  });

  await stream.allReady;

  const body = await consumers.text(stream);

  console.log(body);
  return { body, head: {} };
}
