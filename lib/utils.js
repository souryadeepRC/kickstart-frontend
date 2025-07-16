const { confirm, input, select } = require("@inquirer/prompts");
const { StyleTypeOptions, StyleTypeEnum } = require("../lib/StyleEnum");

async function collectUserOptions() {
  const componentName = await input({ message: "🧩 Component name:" });
  const location = await input({
    message: "📂 Location:",
    default: "src/components",
  });

  const isTypeScript = await confirm({
    message: "🟦 Using TypeScript?",
    default: true,
  });

  const wantsStyles = await confirm({
    message: "🎨 Do you want to include a style file?",
    default: true,
  });

  let styleType = null;

  if (wantsStyles) {
    styleType = await select({
      message: "🧵 Select a styling type:",
      default: StyleTypeEnum.CSS,
      choices: StyleTypeOptions,
    });
  }

  return {
    componentName,
    location,
    isTypeScript,
    styles: {
      wantsStyles,
      styleType,
    },
  };
}

module.exports = { collectUserOptions };
