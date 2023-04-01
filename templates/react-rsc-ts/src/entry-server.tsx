import type { RouteModule, DataModule } from "@impalajs/react-rsc";
export { render } from "@impalajs/react-rsc";
export const routeModules = import.meta.glob<RouteModule>(
  "./routes/**/*.{tsx,jsx}"
);
export const dataModules = import.meta.glob<DataModule>(
  "./routes/**/*.data.{ts,js}"
);
