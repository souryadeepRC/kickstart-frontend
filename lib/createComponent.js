const fs = require("fs");
const path = require("path");
const {
  modifyStyleImport,
  createStyleFile,
} = require("./modifyStyleIntegration");

/**
 * Convert a string to PascalCase (e.g. "post-data" => "PostData")
 */
function toPascalCase(text) {
  return text
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Creates a React component file based on user input
 * @param {Object} answers - Answers collected from CLI prompts
 * @returns {string} componentName - The formatted component name
 */
async function createComponent(answers) {
  const { componentName: rawName, isTypeScript, styles, location } = answers;

  const componentName = toPascalCase(rawName);
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

module.exports = {
  createComponent,
};
