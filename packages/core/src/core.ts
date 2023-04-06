import { ModuleImports, RouteModule } from "./types";
import { createRouter, RadixRouter } from "radix3";
export * from "./shared";
export * from "./types";

export function convertPathToPattern(input: string): string {
  return input
    .replace(/^\.\/routes/, "")
    .replace(/(\/index)?\.[jt]sx?$/, "")
    .replace(/(?:\[(\.{3})?(\w+)\])/g, (_match, isCatchAll, paramName) => {
      if (isCatchAll) {
        return `:${paramName}*`;
      } else {
        return `:${paramName}`;
      }
    });
}

/**
 * Converts a module path to a radix3 route
 */
export function convertPathToRoute(input: string): string {
  return input
    .replace(/^\.\/routes/, "")
    .replace(/(\/index)?\.[jt]sx?$/, "")
    .replace(/(?:\[(\.{3})?(\w+)\])/g, (_match, isCatchAll, paramName) => {
      if (isCatchAll) {
        return `**:${paramName}`;
      } else {
        return `:${paramName}`;
      }
    });
}

export function routerForModules(
  modules: ModuleImports
): RadixRouter<{ chunk: string }> {
  const router = createRouter<{ chunk: string }>();
  for (const path in modules) {
    router.insert(convertPathToRoute(path), { chunk: path });
  }
  return router;
}
