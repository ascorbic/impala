export { render } from "@impalajs/preact";
export const routeModules = import.meta.glob("./routes/**/*.{tsx,jsx}");
export const dataModules = import.meta.glob("./routes/**/*.data.{ts,js}");
