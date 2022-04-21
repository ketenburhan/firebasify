#!/usr/bin/env node
import { createCommand } from "commander";

import firebasify from "./index";
import packageData from "../package.json";
import fs from "fs-extra";

const program = createCommand(packageData.name)
  .version(packageData.version)
  .arguments("<input-file> <output-file>")
  .usage("<input-file> <output-file> [options]")
  .option("-r, --rule [rules...]", "specify rules")
  .option("-u, --unique-key <unique-key>", "specify unique key", "id")
  .addHelpText(
    "after",
    `
Example:
  $ ${packageData.name} old.json new.json --rule id:/posts`
  )
  .description(packageData.description)
  .parse(process.argv);

const [inputFile, outputFile] = program.args;
const { rule, uniqueKey } = program.opts();

if (inputFile === undefined || outputFile === undefined) {
  console.error("Please specify the input and output files:");
  console.log(`${program.name} <input-file> <output-file> [options]`);
  process.exit(1);
}

if (!rule || rule.length == 0) {
  console.error("No rule specified.");
  process.exit(1);
}

fs.readFile(inputFile, "utf8", (err, data) => {
  if (err) throw err;
  let newObj = firebasify(JSON.parse(data), rule, uniqueKey);
  let newJSON = JSON.stringify(newObj);
  fs.writeFile(outputFile, newJSON, "utf8", () => {});
  console.log("firebasified json saved: " + outputFile);
});
