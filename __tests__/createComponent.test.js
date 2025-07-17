const fs = require("fs");
const path = require("path");
const { createComponent } = require("../lib/createComponent");
const { modifyStyleImport, createStyleFile } = require("../lib/modifyStyleIntegration");

jest.mock("fs");
jest.mock("../lib/modifyStyleIntegration");

describe("createComponent", () => {
  const mockAnswers = {
    componentName: "test-component",
    isTypeScript: false,
    styles: {
      wantsStyles: true,
      styleType: "css"
    },
    location: "src/components"
  };

  const mockTemplate = `
    import React from 'react';
    __STYLE_IMPORT__
    const __COMPONENT__ = () => <div>Hello</div>;
    export default __COMPONENT__;
  `;

  const mockPascalName = "TestComponent";
  const componentDir = path.resolve(
    process.cwd(),
    mockAnswers.location,
    mockPascalName
  );

  beforeEach(() => {
    fs.existsSync.mockClear();
    fs.mkdirSync.mockClear();
    fs.readFileSync.mockClear();
    fs.writeFileSync.mockClear();
    createStyleFile.mockClear();
    modifyStyleImport.mockReturnValue("import './TestComponent.css';");
  });

  it("should create the component with correct structure", async () => {
    fs.existsSync.mockReturnValue(false);
    fs.readFileSync.mockReturnValue(mockTemplate);

    const result = await createComponent(mockAnswers);

    expect(fs.existsSync).toHaveBeenCalledWith(componentDir);
    expect(fs.mkdirSync).toHaveBeenCalledWith(componentDir, { recursive: true });

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(componentDir, "TestComponent.jsx"),
      expect.stringContaining("TestComponent")
    );

    expect(createStyleFile).toHaveBeenCalledWith(
      mockAnswers.styles,
      componentDir,
      "TestComponent"
    );

    expect(result).toBe("TestComponent");
  });

  it("should throw error if component directory exists", async () => {
    fs.existsSync.mockReturnValue(true);

    await expect(createComponent(mockAnswers)).rejects.toThrow(
      `Component "${mockPascalName}" already exists at ${componentDir}`
    );

    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it("should use tsx extension when isTypeScript is true", async () => {
    const tsAnswers = { ...mockAnswers, isTypeScript: true };
    fs.existsSync.mockReturnValue(false);
    fs.readFileSync.mockReturnValue(mockTemplate);

    await createComponent(tsAnswers);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(componentDir, "TestComponent.tsx"),
      expect.any(String)
    );
  });

  it("should replace all placeholders in template", async () => {
    fs.existsSync.mockReturnValue(false);
    fs.readFileSync.mockReturnValue(mockTemplate);

    await createComponent(mockAnswers);

    const [filePath, content] = fs.writeFileSync.mock.calls[0];

    expect(content).toContain("TestComponent");
    expect(content).toContain("import './TestComponent.css';");
  });
});
