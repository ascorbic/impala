import { resolve } from "node:path";
import { prerender } from "./prerender";

const [_, __, command, args] = process.argv;

if (!command) {
  console.error("Command not specified");
  process.exit(1);
}

if (command !== "prerender") {
  console.error("Command not supported");
  process.exit(1);
}

const root = args ? resolve(args) : process.cwd();
await prerender(root);
