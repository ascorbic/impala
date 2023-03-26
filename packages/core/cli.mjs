#!/usr/bin/env node
const currentVersion = process.versions.node;
const currentMajor = parseInt(currentVersion.split(".")[0], 10);
const minimumMajorVersion = 16;

if (currentMajor < minimumMajorVersion) {
  console.error(`Node.js v${currentVersion} is unsupported!`);
  console.error(`Please use Node.js v${minimumMajorVersion} or higher.`);
  process.exit(1);
}

import("./dist/cli.mjs").then(({ main }) => main());
