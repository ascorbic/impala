import { renderToStaticMarkup } from "react-dom/server";
// @ts-ignore
import * as ReactServerDom from "react-server-dom-webpack/server.node";
// @ts-ignore
import * as ReactClient from "react-server-dom-webpack/client.node";

import { ElementType, useContext } from "react";
import type { Context, RouteModule } from "@impalajs/core";
import { Writable, WritableOptions } from "node:stream";
import { HeadContext } from "./head-context";
import { promises as fs } from "node:fs";

class StringResponse extends Writable {
  private buffer: string;
  private responseData: Promise<string>;
  constructor(options?: WritableOptions) {
    super(options);
    this.buffer = "";
    this.responseData = new Promise((resolve, reject) => {
      this.on("finish", () => resolve(this.buffer));
      this.on("error", reject);
    });
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    console.log("chunk", chunk);
    this.buffer += chunk;
    callback();
  }

  getData(): Promise<string> {
    return this.responseData;
  }
}

function HeadContent() {
  const headProvider = useContext(HeadContext);
  return <>{...headProvider.getHead()}</>;
}

export async function render(
  context: Context,
  mod: () => Promise<RouteModule<ElementType>>,
  bootstrapModules?: Array<string>
) {
  // @ts-ignore
  const { default: bundleMapPath } = await import("virtual:client-bundle-map");
  console.log(bundleMapPath);
  const bundleMap = JSON.parse(await fs.readFile(bundleMapPath, "utf-8"));
  console.log(bundleMap);
  const { default: Page } = await mod();

  const response = new StringResponse();

  const stream = ReactServerDom.renderToPipeableStream(
    <Page {...context} />,
    {
      bootstrapModules,
      bootstrapScriptContent: `window.___CONTEXT=${JSON.stringify(context)};`,
    },
    bundleMap
  );

  console.log(stream);

  const something = ReactClient.createFromNodeStream(stream, bundleMap);
  console.log(something);
  const body = await response.getData();

  const head = renderToStaticMarkup(<HeadContent />);

  return { body, head };
}
