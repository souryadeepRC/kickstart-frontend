const fs = require("fs");
const path = require("path");
const {
  modifyStyleImport,
  createStyleFile,
} = require("../lib/styleIntegration");
const { createComponentFile } = require("../lib/createComponent");

jest.mock("fs");
jest.mock("../lib/styleIntegration");

const mockAnswers = {
  componentName: "my-component",
  isTypeScript: false,
  styles: {
    wantsStyles: true,
    styleType: "css",
  },
  location: "src/components",
};

const mockPascalName = "MyComponent";
jest.mock("../lib/utils", () => ({
  convertToPascalCase: jest.fn(() => mockPascalName),
  collectUserOptions: jest.fn(() => {
    return Promise.resolve(mockAnswers);
  }),
  pause: jest.fn(),
}));
describe("createComponentFile", () => {
  const mockTemplate = `
    import React from 'react';
    __STYLE_IMPORT__
    const __COMPONENT__ = () => <div>Hello</div>;
    export default __COMPONENT__;
  `;

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
    modifyStyleImport.mockReturnValue("import './MyComponent.css';");
  });

  it("should create the component with correct structure", async () => {
    fs.existsSync.mockReturnValue(false);
    fs.readFileSync.mockReturnValue(mockTemplate);

    const result = await createComponentFile(mockAnswers);

    expect(fs.existsSync).toHaveBeenCalledWith(componentDir);
    expect(fs.mkdirSync).toHaveBeenCalledWith(componentDir, {
      recursive: true,
    });

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(componentDir, "MyComponent.jsx"),
      expect.stringContaining("MyComponent")
    );

    expect(createStyleFile).toHaveBeenCalledWith(
      mockAnswers.styles,
      componentDir,
      "MyComponent"
    );

    expect(result).toBe("MyComponent");
  });

  it("should throw error if component directory exists", async () => {
    fs.existsSync.mockReturnValue(true);

    await expect(createComponentFile(mockAnswers)).rejects.toThrow(
      `Component "${mockPascalName}" already exists at ${componentDir}`
    );

    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it("should use tsx extension when isTypeScript is true", async () => {
    const tsAnswers = { ...mockAnswers, isTypeScript: true };
    fs.existsSync.mockReturnValue(false);
    fs.readFileSync.mockReturnValue(mockTemplate);

    await createComponentFile(tsAnswers);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(componentDir, "MyComponent.tsx"),
      expect.any(String)
    );
  });

  it("should replace all placeholders in template", async () => {
    fs.existsSync.mockReturnValue(false);
    fs.readFileSync.mockReturnValue(mockTemplate);

    await createComponentFile(mockAnswers);

    const [filePath, content] = fs.writeFileSync.mock.calls[0];

    expect(content).toContain("MyComponent");
    expect(content).toContain("import './MyComponent.css';");
  });
});
