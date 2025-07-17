jest.mock("@inquirer/prompts");

const { input, confirm, select } = require("@inquirer/prompts");
const { collectUserOptions, convertToPascalCase, pause } = require("../lib/utils");

describe("collectUserOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct user answers with styles", async () => {
    input.mockResolvedValueOnce("TestComponent"); // Component name
    input.mockResolvedValueOnce("src/components"); // Location
    confirm.mockResolvedValueOnce(true); // isTypeScript
    confirm.mockResolvedValueOnce(true); // wantsStyles
    select.mockResolvedValueOnce("scss"); // styleType

    const result = await collectUserOptions();

    expect(result).toEqual({
      componentName: "TestComponent",
      location: "src/components",
      isTypeScript: true,
      styles: {
        wantsStyles: true,
        styleType: "scss",
      },
    });
  });

  it("should handle when user opts out of styles", async () => {
    input.mockResolvedValueOnce("SimpleBox");
    input.mockResolvedValueOnce("src/ui");
    confirm.mockResolvedValueOnce(false); // isTypeScript
    confirm.mockResolvedValueOnce(false); // wantsStyles

    const result = await collectUserOptions();

    expect(result).toEqual({
      componentName: "SimpleBox",
      location: "src/ui",
      isTypeScript: false,
      styles: {
        wantsStyles: false,
        styleType: null, // default when skipped
      },
    });

    expect(select).not.toHaveBeenCalled();
  });
});

describe("convertToPascalCase", () => {
  it("should convert kebab-case to PascalCase", () => {
    expect(convertToPascalCase("my-component")).toBe("MyComponent");
  });

  it("should convert snake_case to PascalCase", () => {
    expect(convertToPascalCase("my_component")).toBe("MyComponent");
  });

  it("should convert space separated text to PascalCase", () => {
    expect(convertToPascalCase("my component name")).toBe("MyComponentName");
  });

  it("should remove special characters and convert to PascalCase", () => {
    expect(convertToPascalCase("my@component#name!")).toBe("MyComponentName");
  });

  it("should handle already PascalCase input", () => {
    expect(convertToPascalCase("MyComponent")).toBe("MyComponent");
  });

  it("should handle mixed case and symbols", () => {
    expect(convertToPascalCase("my_Component-name")).toBe("MyComponentName");
  });

  it("should return empty string for empty input", () => {
    expect(convertToPascalCase("")).toBe("");
  });

  it("should trim leading/trailing separators", () => {
    expect(convertToPascalCase("--my-component--")).toBe("MyComponent");
  });
});

describe("pause", () => {
  const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log one newline by default", () => {
    pause();
    expect(logSpy).toHaveBeenCalledWith("\n");
  });

  it("should log multiple newlines when lines is specified", () => {
    pause(3);
    expect(logSpy).toHaveBeenCalledWith("\n\n\n");
  });
});
