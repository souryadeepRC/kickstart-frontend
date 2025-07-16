#!/usr/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");
const { default: boxen } = require("boxen");
const { default: ora } = require("ora");

const { collectUserOptions } = require("../lib/utils");
const { createComponent } = require("../lib/createComponent");

function pause(lines = 1) {
  console.log("\n".repeat(lines));
}

function printHeader(title) {
  figlet(title, (err, data) => {
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

    runGenerator();
  });
}

async function runGenerator() {
  try {
    const answers = await collectUserOptions();
    pause();

    const spinner = ora("Creating component...").start();

    const componentName = await createComponent(answers);

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
    process.exit(1);
  }
}

(async () => {
  console.log(chalk.blueBright("======= React Component Generator ======="));
  printHeader("Component Generator");
})();
