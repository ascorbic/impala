import { useContext } from "preact/hooks";
import renderToString from "preact-render-to-string";
import type { ComponentType } from "preact";
import type { Context, RouteModule } from "@impalajs/core";
import { HeadContext } from "./head-context";

function HeadContent() {
  const headProvider = useContext(HeadContext);
  return <>{...headProvider.getHead()}</>;
}

export async function render(
  context: Context,
  mod: () => Promise<RouteModule<ComponentType<Context>>>,
  bootstrapModules?: Array<string>
) {
  const { default: Page } = await mod();

  const body = renderToString(<Page {...context} />);

  const modules = bootstrapModules?.map(
    (m) => `<script type="module" src="${m}"></script>`
  );

  const headContent = renderToString(<HeadContent />);

  return {
    body,
    head: [
      headContent,
      `<script>window.___CONTEXT=${JSON.stringify(context)};</script>`,
      modules,
    ].join(""),
  };
}
