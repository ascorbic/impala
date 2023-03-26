#!/usr/bin/env node
const currentVersion = process.versions.node;
const requiredMajorVersion = parseInt(currentVersion.split(".")[0], 10);
const minimumMajorVersion = 16;

if (requiredMajorVersion < minimumMajorVersion) {
  console.error(`Node.js v${currentVersion} is unsupported!`);
  console.error(`Please use Node.js v${minimumMajorVersion} or higher.`);
  process.exit(1);
}

import("./dist/cli.js").then(({ createImpala }) => createImpala());
