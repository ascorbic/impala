import type { ModuleImports, RouteModule } from "@impalajs/core";
import type { ElementType } from "react";
import ReactDOM from "react-dom/client";

export type RouteModules = ModuleImports<RouteModule<ElementType>>;

export function clientBootstrap(
  modules: ModuleImports<RouteModule<ElementType>>
) {
  const context = (window as any).___CONTEXT;

  if (context.chunk) {
    const mod = modules[context.chunk];
    if (mod) {
      mod().then(({ default: Page }) => {
        ReactDOM.hydrateRoot(document, <Page {...context} />);
      });
    } else {
      console.error(
        `Could not hydrate page. Module not found: ${context.chunk}`
      );
    }
  }
}
