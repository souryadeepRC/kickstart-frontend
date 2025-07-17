const fs = require("fs");
const path = require("path");

describe("JSX Template", () => {
  const templatePath = path.resolve(__dirname, "../templates/component.jsx.tpl");

  it("should exist", () => {
    expect(fs.existsSync(templatePath)).toBe(true);
  });

  it("should contain the required placeholders", () => {
    const content = fs.readFileSync(templatePath, "utf-8");

    expect(content).toContain("__COMPONENT__");
    expect(content).toContain("__STYLE_IMPORT__");
  });

  it("should be a valid JSX string (basic syntax)", () => {
    const content = fs.readFileSync(templatePath, "utf-8");

    // basic JSX sanity checks
    expect(content).toMatch(/function|const|class/); // some form of component declaration
    expect(content).toMatch(/return\s*\(.*\)/s); // should contain a return JSX block
  });
});
