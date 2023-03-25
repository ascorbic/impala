import type { DataModule, ModuleImports, RouteModule } from "@impalajs/core";
import type { ElementType } from "react";

export * from "./entry-server";

export type RouteModules = ModuleImports<RouteModule<ElementType>>;
export type DataModules = ModuleImports<DataModule>;
