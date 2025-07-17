const { confirm, input, select } = require("@inquirer/prompts");
const { StyleTypeOptions, StyleTypeEnum } = require("./StyleEnum");

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
/**
 * Convert a string to PascalCase (e.g. "post-data" => "PostData")
 */
function convertToPascalCase(text) {
  return text
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
function pause(lines = 1) {
  console.log("\n".repeat(lines));
}
module.exports = { collectUserOptions, convertToPascalCase, pause };
