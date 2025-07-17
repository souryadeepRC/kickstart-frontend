jest.mock("@inquirer/prompts");

const { input, confirm, select } = require("@inquirer/prompts");
const { collectUserOptions } = require("../lib/utils");

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
