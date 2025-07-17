const fs = require("fs");
const path = require("path");
const { default: ora } = require("ora");
const { default: boxen } = require("boxen");
const chalk = require("chalk");

const { modifyStyleImport, createStyleFile } = require("./styleIntegration");
const {
  pause,
  convertToPascalCase,
  collectUserOptions,
} = require("../lib/utils");

/**
 * Creates a React component file based on user input
 * @param {Object} answers - Answers collected from CLI prompts
 * @returns {string} componentName - The formatted component name
 */
async function createComponentFile(answers) {
  const { componentName: rawName, isTypeScript, styles, location } = answers;

  const componentName = convertToPascalCase(rawName);
  const componentDir = path.resolve(
    process.cwd(),
    path.normalize(location),
    componentName
  );

  if (fs.existsSync(componentDir)) {
    throw new Error(
      `Component "${componentName}" already exists at ${componentDir}`
    );
  }

  // Create the directory structure
  fs.mkdirSync(componentDir, { recursive: true });

  const extension = isTypeScript ? "tsx" : "jsx";
  const templatePath = path.resolve(
    __dirname,
    `../templates/component.${extension}.tpl`
  );

  // Read and process template
  let content = fs.readFileSync(templatePath, "utf-8");

  content = content
    .replace(/__COMPONENT__/g, componentName)
    .replace(/__STYLE_IMPORT__/g, modifyStyleImport(styles, componentName));

  // Write the component file
  const componentFile = path.join(
    componentDir,
    `${componentName}.${extension}`
  );
  fs.writeFileSync(componentFile, content);

  // Generate associated style file
  createStyleFile(styles, componentDir, componentName);

  return componentName;
}

async function generateReactComponent() {
  try {
    const answers = await collectUserOptions();

    pause();

    const spinner = ora("Creating component...").start();

    const componentName = await createComponentFile(answers);

    spinner.succeed(
      chalk.greenBright.bold(
        `Component "${componentName}" created successfully! 🎉`
      )
    );

    const successMsg = boxen(
      chalk.greenBright(`🎉 ${componentName} is ready to use!`),
      {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "green",
        backgroundColor: "#1e1e1e",
      }
    );

    console.log(successMsg);
  } catch (error) {
    ora().fail(chalk.red("❌ Component creation failed"));
    console.error(chalk.red(error));
    pause()
    process.exit(1);
  }
}
module.exports = {
  createComponentFile,
  generateReactComponent,
};
