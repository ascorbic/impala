import type {
  ModuleImports,
  RouteModule as CoreRouteModule,
} from "@impalajs/core";
import type { ElementType } from "react";
import ReactDOM from "react-dom/client";

export type RouteModule = CoreRouteModule<ElementType>;
export function clientBootstrap(modules: ModuleImports<RouteModule>) {
  const context = (window as any).___CONTEXT;

  if (context && "chunk" in context) {
    const mod = modules[context.chunk];
    if (mod) {
      mod().then(({ default: Page }) => {
        ReactDOM.hydrateRoot(
          document.getElementById("app")!,
          <Page {...context} />
        );
      });
    } else {
      console.error(
        `[Impala] Could not hydrate page. Module not found: ${context?.chunk}`
      );
    }
  } else {
    console.log("[Impala] No context found. Skipping hydration.");
  }
}
