import type {
  DataModule,
  ModuleImports,
  RouteModule as CoreRouteModule,
} from "@impalajs/core";
import type { ElementType } from "react";
export type RouteModule = CoreRouteModule<ElementType>;
export type { DataModule };

export * from "./entry-server";
