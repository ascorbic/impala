import { clientBootstrap, RouteModules } from "@impalajs/react/client";

const modules = import.meta.glob("./routes/*.tsx") as RouteModules;

clientBootstrap(modules);
