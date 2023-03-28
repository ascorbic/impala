import { clientBootstrap } from "@impalajs/preact/client";

const modules = import.meta.glob("./routes/**/*.{tsx,jsx}");

clientBootstrap(modules);
