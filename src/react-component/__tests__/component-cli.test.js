/* const { runGenerator, printHeader } = require("../../../bin/component-cli"); */
const { createReactCLI } = require("../lib/cli-command");
/* const { createComponent } = require("../lib/createComponent"); */

jest.mock("chalk", () => {
  const blueBright = jest.fn((text) => `chalk greenBright(${text})`);
  const greenBright = jest.fn((text) => `chalk greenBright(${text})`);
  greenBright.bold = jest.fn((text) => `chalk greenBright.bold(${text})`);

  const red = jest.fn((text) => `chalk red(${text})`);

  return {
    blueBright,
    greenBright,
    red,
    default: {
      greenBright,
      red,
    },
  };
});
jest.mock("figlet");
const figlet = require("figlet");

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

jest.mock("../lib/createComponent", () => ({
  generateReactComponent: jest.fn(() => Promise.resolve("My Component")),
}));

describe("createReactCLI", () => {
  const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should handle figlet successfully", async () => {
    figlet.mockImplementation((text, cb) => {
      cb(null, `FIGLET: ${text}`);
    });
    await createReactCLI();
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      "chalk greenBright(======= React Component Generator =======)"
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      "BOXEN: FIGLET: Component Generator"
    );
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should handle figlet error gracefully", async () => {
    figlet.mockImplementation((text, cb) => {
      cb("Fighlet error", null);
    });
    await createReactCLI();

    expect(errorSpy).toHaveBeenCalledWith(
      "chalk red(❌ Something went wrong with figlet.)"
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

