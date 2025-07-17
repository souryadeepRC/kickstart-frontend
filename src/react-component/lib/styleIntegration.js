const fs = require("fs");
const path = require("path");
const { StyleTypeEnum } = require("./StyleEnum");

/**
 * Creates a style file for the given component if styling is enabled
 * @param {Object} styles - User style preferences
 * @param {string} componentDir - Directory where the component resides
 * @param {string} componentName - Name of the component
 */
function createStyleFile(styles, componentDir, componentName) {
  const { wantsStyles, styleType } = styles;

  if (!wantsStyles) return "";

  const styleFileName = `${componentName}.${styleType}`;
  const styleFilePath = path.join(componentDir, styleFileName);

  fs.writeFileSync(styleFilePath, ""); // Empty style file
}

/**
 * Returns the appropriate style import string based on the user's choice
 * @param {Object} styles - User style preferences
 * @param {string} componentName - Name of the component
 * @returns {string} Import statement
 */
function modifyStyleImport(styles, componentName) {
  const { wantsStyles, styleType } = styles;

  if (!wantsStyles) return "";

  return styleType === StyleTypeEnum.SCSS_MODULE.value
    ? `import classes from './${componentName}.module.scss';`
    : `import './${componentName}.${styleType}';`;
}

module.exports = {
  modifyStyleImport,
  createStyleFile,
};
