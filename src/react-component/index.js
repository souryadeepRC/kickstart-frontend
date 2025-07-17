const {
  createComponentFile,
  generateReactComponent,
} = require("./lib/createComponent");
const {
  collectUserOptions,
  convertToPascalCase,
  pause,
} = require("./lib/utils");
const {
  modifyStyleImport,
  createStyleFile,
} = require("./lib/styleIntegration");

module.exports = {
  createComponentFile,
  generateReactComponent,
  collectUserOptions,
  modifyStyleImport,
  createStyleFile,
  convertToPascalCase,
  pause,
};
