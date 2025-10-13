import renderToString from "preact-render-to-string";
import type { ComponentType } from "preact";
import type { Context, RouteModule } from "@impalajs/core";
import { HeadContext, HeadManager } from "./head-context";

function HeadContent({ headManager }: { headManager: HeadManager }) {
  return <>{...headManager.getHead()}</>;
}

export async function render(
  context: Context,
  mod: () => Promise<RouteModule<ComponentType<Context>>>,
  bootstrapModules?: Array<string>
) {
  const { default: Page } = await mod();

  // We create a new head manager for each request to avoid sharing state across routes
  const headManager = new HeadManager();

  const body = renderToString(
    <HeadContext.Provider value={headManager}>
      <Page {...context} />
    </HeadContext.Provider>
  );

  const modules = bootstrapModules?.map(
    (m) => `<script type="module" src="${m}"></script>`
  );

  // We then pass the head manager instance that is specific to this request to SSR
  const headContent = renderToString(<HeadContent headManager={headManager} />);

  return {
    body,
    head: [
      headContent,
      `<script>window.___CONTEXT=${JSON.stringify(context)};</script>`,
      modules,
    ].join(""),
  };
}
