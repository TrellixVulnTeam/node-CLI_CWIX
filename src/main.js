const inquirer = require("inquirer");
const path = require('path');
const { writeFile, readdir, readFile } = require("fs").promises;
// initialization of config paths
const configFiles = {};
const configFolderPath = path.resolve(__dirname, 'config');


(async () => {

  const files = await readdir(configFolderPath).catch(console.error);

  for (let i of files) {
    // framework name is situated between 2 dots eg- react between 2 '.'(s)
    const frameworkName = i.split('.')[1];
    configFiles[frameworkName] = path.join(configFolderPath, i);
  }
	const {currentFramework} = await inquirer.prompt([
    {
      type: "list",
      message: "Pick the technology you're using:",
      name: "currentFramework",
      choices: Object.keys(configFiles),
    }
  ]);

console.log("The chosen config is ", currentFramework);
  let config = await readFile(configFiles[currentFramework]).catch(console.error);  
	const tsconfig = path.join(process.cwd(), 'tsconfig.json');

  if (currentFramework["technology"] === "node") {     
const reg = new RegExp(/(?<=v)(\d+)/);
    const version = parseInt(reg.exec(process.version)[0]);

    if (version >= 14) {
      // Optimal config for Node v14.0.0 (full ES2020)
      const updateConfig = {
        allowSyntheticDefaultImports: true,
        lib: ["es2020"],
        module: "commonjs",
        moduleResolution: "node",
        target: "es2020",
      };

      const configObj = Object.keys(updateConfig).reduce((prev, curr) => {
        return {
          ...prev,
          compilerOptions: {
            ...prev.compilerOptions,
            [curr]: updateConfig[curr],
          },
        };

      }, JSON.parse(configObj.toString()));

      config = JSON.stringify(configObj, null, 2);
    }
  }
//console.log("Config .. ", configObj);
  await writeFile(tsconfig, config.toString()).catch(err=> {
    console.log(err);
    process.exit();
  });

  console.log("tsconfig.json successfully created");
})();
