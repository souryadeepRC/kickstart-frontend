const fs = require("fs");
const path = require("path");
const {
  createStyleFile,
  modifyStyleImport,
} = require("../lib/styleIntegration");

jest.mock("fs");

describe("modifyStyleIntegration", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createStyleFile", () => {
    const componentDir = "/mock/path";
    const componentName = "MyComponent";

    it("should not create file when wantsStyles is false", () => {
      createStyleFile({ wantsStyles: false }, componentDir, componentName);

      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it("should create style file with correct name and extension", () => {
      const styleType = "scss";

      createStyleFile(
        { wantsStyles: true, styleType },
        componentDir,
        componentName
      );

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(componentDir, `${componentName}.${styleType}`),
        ""
      );
    });
  });

  describe("modifyStyleImport", () => {
    const componentName = "MyComponent";

    it("should return empty string if wantsStyles is false", () => {
      const result = modifyStyleImport({ wantsStyles: false }, componentName);
      expect(result).toBe("");
    });

    it("should return import for normal CSS/SCSS", () => {
      const result = modifyStyleImport(
        { wantsStyles: true, styleType: "scss" },
        componentName
      );
      expect(result).toBe(`import './${componentName}.scss';`);
    });

    it("should return import for module.scss", () => {
      const result = modifyStyleImport(
        { wantsStyles: true, styleType: "module.scss" },
        componentName
      );
      expect(result).toBe(
        `import classes from './${componentName}.module.scss';`
      );
    });
  });
});
