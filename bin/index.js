let fs = require("fs");
let commander = require("commander");

let firebasify = require("../index");
let packageData = require("../package.json");

const program = commander
  .name(packageData.name)
  .version(packageData.version)
  .arguments("<input-file> <output-file>")
  .usage("<input-file> <output-file>")
  .description(packageData.description)
  .parse(process.argv);

const [inputFile, outputFile] = program.args;

if (inputFile === undefined || outputFile === undefined) {
  console.error("Please specify the input and output files:");
  console.log(`${program.name} <input-file> <output-file>`);
  process.exit(1);
}

fs.readFile(inputFile, "utf8", (err, data) => {
  let newObj = firebasify(JSON.parse(data));
  let newJSON = JSON.stringify(newObj);
  fs.writeFile(outputFile, newJSON, "utf8", () => {});
  console.log("firebasified json saved: " + outputFile);
});
