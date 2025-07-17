const { StyleTypeEnum } = require("../lib/StyleEnum");

describe("StyleEnum", () => {
  it("should have correct CSS value", () => {
    expect(StyleTypeEnum.CSS.label).toBe("CSS");
    expect(StyleTypeEnum.CSS.value).toBe("css");
  });

  it("should have correct SCSS value", () => {
    expect(StyleTypeEnum.SCSS.label).toBe("SCSS");
    expect(StyleTypeEnum.SCSS.value).toBe("scss");
  });

  it("should have correct SCSS_MODULE value", () => {
    expect(StyleTypeEnum.SCSS_MODULE.label).toBe("scss module");
    expect(StyleTypeEnum.SCSS_MODULE.value).toBe("module.scss");
  });

  it("should not have extra keys", () => {
    const keys = Object.keys(StyleTypeEnum);
    expect(keys).toEqual(["CSS", "SCSS", "SCSS_MODULE"]);
  });
});
