import type {
  DataModule,
  RouteModule as CoreRouteModule,
} from "@impalajs/core";
import type { ComponentChildren } from "preact";
export type RouteModule = CoreRouteModule<ComponentChildren>;
export type { DataModule };

export * from "./entry-server";
