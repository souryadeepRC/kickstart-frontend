const fs = require("fs");
const path = require("path");

describe("TSX Template", () => {
  const templatePath = path.resolve(__dirname, "../templates/component.tsx.tpl");

  it("should exist", () => {
    expect(fs.existsSync(templatePath)).toBe(true);
  });

  it("should contain required placeholders", () => {
    const content = fs.readFileSync(templatePath, "utf-8");

    expect(content).toContain("__COMPONENT__");
    expect(content).toContain("__STYLE_IMPORT__");
  });

  it("should include TypeScript/TSX syntax", () => {
    const content = fs.readFileSync(templatePath, "utf-8");

    // Type annotations or TSX syntax check
    expect(content).toMatch(/:\s*React\.FC|Props/i); // type annotations
    //expect(content).toMatch(/<.*\/>/s); // JSX usage
    //expect(content).toMatch(/import\s+.*from\s+['"][^'"]+['"]/); // import statement
  });
});
