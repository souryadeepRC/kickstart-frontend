const { printHeader } = require("../bin/component-cli");
const { createComponent } = require("../lib/createComponent");

jest.mock("chalk", () => {
  const greenBright = jest.fn((text) => `chalk greenBright(${text})`);
  greenBright.bold = jest.fn((text) => `chalk greenBright.bold(${text})`);

  const red = jest.fn((text) => `chalk red(${text})`);

  return {
    greenBright,
    red,
    default: {
      greenBright,
      red,
    },
  };
});
jest.mock("figlet", () =>
  jest.fn((text, cb) => {
    if (text.includes("Error")) {
      cb("Fighlet error", null);
    } else {
      cb(null, `FIGLET: ${text}`);
    }
  })
);
jest.mock("boxen", () => {
  const boxenMock = (text, opts) => `BOXEN: ${text}`;
  boxenMock.default = boxenMock;
  return boxenMock;
});
jest.mock("ora", () => {
  const oraMock = () => ({
    start: jest.fn().mockReturnThis(),
    succeed: jest.fn(),
    fail: jest.fn(),
  });
  oraMock.default = oraMock;
  return oraMock;
});

jest.mock("../lib/utils", () => ({
  collectUserOptions: jest.fn(() => {
    return Promise.resolve({
      componentName: "MyComponent",
      isTypeScript: false,
      location: "src/components",
      styles: {
        wantsStyles: true,
        styleType: "css",
      },
    });
  }),
}));

jest.mock("../lib/createComponent", () => ({
  createComponent: jest.fn((options) => Promise.resolve("My Component")),
}));

describe("CLI Script", () => {
  const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
    /* logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore(); */
  });

  it("should display header and create component successfully", async () => {
    //const mockCreate = require("../lib/createComponent").createComponent;
    //mockCreate.mockImplementation(() => Promise.resolve("My Component"));
    createComponent.mockImplementation(() => {
      return Promise.resolve("My Component");
    });
    await printHeader("Component Generator");
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      "BOXEN: FIGLET: Component Generator"
    );
    expect(logSpy).toHaveBeenNthCalledWith(2, "\n");
    expect(logSpy).toHaveBeenNthCalledWith(
      3,
      "BOXEN: chalk greenBright(🎉 Sample is ready to use!)"
    );

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should handle figlet error gracefully", async () => {
    await printHeader("Component Error Generator");

    expect(errorSpy).toHaveBeenCalledWith(
      "chalk red(❌ Something went wrong with figlet.)"
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("should handle component creation failure", async () => {
    createComponent.mockImplementation(() => {
      throw new Error("Failed to create component");
    });
    await printHeader("Component Generator");
    expect(errorSpy).toHaveBeenCalledWith(
      "chalk red(Error: Failed to create component)"
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
