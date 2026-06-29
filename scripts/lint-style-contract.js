const fs = require("node:fs");
const path = require("node:path");

const contractPath = path.join(process.cwd(), "test", "style_contract.js");

if (!fs.existsSync(contractPath)) {
  console.log("No test/style_contract.js found; skipping.");
  process.exit(0);
}

require(contractPath);
