import type { RouteModules, DataModules } from "@impalajs/react";
export { render } from "@impalajs/react";
export const routeModules = import.meta.glob(
  "./routes/**/*.{tsx,jsx}"
) as RouteModules;
export const dataModules = import.meta.glob(
  "./routes/**/*.data.{ts,js}"
) as DataModules;
