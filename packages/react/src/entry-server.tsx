import { renderToPipeableStream, renderToStaticMarkup } from "react-dom/server";
import { ElementType } from "react";
import type { Context, RouteModule } from "@impalajs/core";
import { Writable, WritableOptions } from "node:stream";
import { HeadContext, HeadManager } from "./head-context";

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
    this.buffer += chunk;
    callback();
  }

  getData(): Promise<string> {
    return this.responseData;
  }
}

function HeadContent({ headManager }: { headManager: HeadManager }) {
  return <>{...headManager.getHead()}</>;
}

export async function render(
  context: Context,
  mod: () => Promise<RouteModule<ElementType>>,
  bootstrapModules?: Array<string>
) {
  const { default: Page } = await mod();

  // We create a new head manager for each request to avoid sharing state across routes
  const headManager = new HeadManager();

  const response = new StringResponse();

  const { pipe } = renderToPipeableStream(
    // Now on each render, each page will use their own head context instead of default one
    (
      <HeadContext.Provider value={headManager}>
        <Page {...context} />
      </HeadContext.Provider>
    ),
    {
      bootstrapModules,
      bootstrapScriptContent: `window.___CONTEXT=${JSON.stringify(context)};`,
      onAllReady() {
        pipe(response);
      },
      onError(error) {
        console.error(error);
      },
    });

  const body = await response.getData();

  const head = renderToStaticMarkup(<HeadContent headManager={headManager} />);

  return { body, head };
}
