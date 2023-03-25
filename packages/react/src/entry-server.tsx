import { renderToPipeableStream } from "react-dom/server";
import type { ElementType } from "react";
import type { Context, RouteModule } from "@impalajs/core";
import { Writable, WritableOptions } from "node:stream";

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

export async function render(
  context: Context,
  mod: () => Promise<RouteModule<ElementType>>,
  bootstrapModules?: Array<string>
) {
  const { default: Page } = await mod();

  const response = new StringResponse();

  const { pipe } = renderToPipeableStream(<Page {...context} />, {
    bootstrapModules,
    bootstrapScriptContent: `window.___CONTEXT=${JSON.stringify(context)};`,
    onAllReady() {
      pipe(response);
    },
    onError(error) {
      console.error(error);
    },
  });

  return await response.getData();
}
