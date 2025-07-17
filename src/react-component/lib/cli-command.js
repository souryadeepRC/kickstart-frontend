const chalk = require("chalk");
const figlet = require("figlet");
const { default: boxen } = require("boxen");
const { generateReactComponent } = require("./createComponent");

function createReactCLI() {
  console.log(chalk.blueBright("======= React Component Generator ======="));

  figlet("Component Generator", (err, data) => {
    if (err) {
      console.error(chalk.red("❌ Something went wrong with figlet."));
      console.error(chalk.red(err));
      process.exit(1);
    }

    console.log(
      boxen(data, {
        padding: 1,
        margin: 1,
        borderStyle: "classic",
        borderColor: "yellow",
      })
    );

    generateReactComponent();
  });
}

module.exports = {
  createReactCLI,
};
