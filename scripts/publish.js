const fs = require("fs-extra");
const { join } = require("path");
const { exec } = require("shelljs");

const publish = async () => {

  const packagesDir = join(__dirname, "..", "packages");
  const packagesList = await fs.readdir(packagesDir);
  console.log(packagesList);

  packagesList.forEach(package => {
    console.log(`Building ${package}...`);
    console.log(exec(`cd ../packages/${package} && npm run build`).stdout);
  });
;
}

publish()
  .then(() => console.log("Published successfully!"))
  .catch(error => console.log("ERR", error))
  .finally(() => process.exit(0));
