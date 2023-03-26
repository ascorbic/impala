import { resolve } from "node:path";
import { createServer } from "./dev";
import { prerender } from "./prerender";

const [_, __, command, args] = process.argv;

if (!command) {
  console.error("Command not specified");
  process.exit(1);
}

if (command === "prerender") {
  const root = args ? resolve(args) : process.cwd();
  await prerender(root);
} else if (command === "dev") {
  createServer();
} else {
  console.error("Command not supported. Supported commands: dev, prerender");
  process.exit(1);
}
