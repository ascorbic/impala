import { intro, outro, spinner, text, isCancel } from "@clack/prompts";
import degit from "degit";
import { existsSync } from "node:fs";
import color from "picocolors";

export async function createImpala() {
  intro(color.bgYellow(color.bold(" create-impala ")));

  const target = await text({
    message: "Where would you like to create your project?",
    placeholder: "my-impala-app",
    initialValue: "my-impala-app",
    validate(value) {
      if (existsSync(value)) {
        return "That folder already exists! Please choose another.";
      }
    },
  });
  if (isCancel(target)) {
    outro("Cancelled");
    return;
  }
  const s = spinner();

  s.start("Setting up your project...");

  const emitter = degit("ascorbic/impala/templates/react-ts", {
    cache: false,
  });

  emitter.on("info", (info: any) => {
    console.log(info.message);
  });

  await emitter.clone(target);
  s.stop("Set up your project");
  outro(`You're all set!`);
}