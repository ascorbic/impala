import type {
  ModuleImports,
  RouteModule as CoreRouteModule,
} from "@impalajs/core";
import { hydrate, ComponentType } from "preact";

export type RouteModule = CoreRouteModule<ComponentType>;
export function clientBootstrap(modules: ModuleImports<RouteModule>) {
  const context = (window as any).___CONTEXT;

  if (context && "chunk" in context) {
    const mod = modules[context.chunk];
    if (mod) {
      mod().then(({ default: Page }) => {
        hydrate(<Page {...context} />, document.getElementById("__impala")!);
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
