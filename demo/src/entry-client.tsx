import { clientBootstrap, RouteModule } from "@impalajs/react/client";

const modules = import.meta.glob<RouteModule>("./routes/*.tsx");

clientBootstrap(modules);
