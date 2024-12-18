import { intro, outro, spinner, text, isCancel, select } from "@clack/prompts";
import degit from "degit";
import { existsSync, promises as fs } from "node:fs";
import { join } from "node:path";
import color from "picocolors";

export async function createImpala() {
  intro(color.black(color.bgYellow(" create-impala ")));

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

  const language = await select({
    message: "Which language would you like to use?",
    options: [
      { value: "ts", label: "TypeScript" },
      { value: "js", label: "JavaScript" },
    ],
  });

  if (isCancel(language)) {
    outro("Cancelled");
    return;
  }

  const framework = await select({
    message: "Which framework would you like to use?",
    options: [
      { value: "react", label: "React" },
      { value: "preact", label: "Preact" },
    ],
  });

  if (isCancel(framework)) {
    outro("Cancelled");
    return;
  }

  const s = spinner();

  s.start("Setting up your project...");

  const emitter = degit(`ascorbic/impala/templates/${framework}-${language}`, {
    cache: false,
  });

  emitter.on("info", (info: any) => {
    console.log(info.message);
  });

  emitter.on("error", (error: any) => {
    console.log(error.message);
  });

  await emitter.clone(target);
  s.stop("Set up your project");
  const packageJsonPath = join(target, "package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
  packageJson.name = target.replaceAll(/[^a-zA-Z0-9-]/g, "-");
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  outro(
    `You're all set!\n\nTo get started, run:\n\n  cd ${target}\n  npm install\n  npm run dev`
  );
}
