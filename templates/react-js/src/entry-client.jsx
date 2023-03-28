import { clientBootstrap } from "@impalajs/react/client";

const modules = import.meta.glob("./routes/**/*.{tsx,jsx}");

clientBootstrap(modules);
