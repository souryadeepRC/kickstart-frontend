const StyleTypeEnum = {
  CSS: { label: "CSS", value: "css" },
  SCSS: { label: "SCSS", value: "scss" },
  SCSS_MODULE: { label: "scss module", value: "module.scss" },
};
const StyleTypeOptions = [
  {
    name: StyleTypeEnum.CSS.label,
    value: StyleTypeEnum.CSS.value,
    description: "Vanilla CSS",
  },
  {
    name: StyleTypeEnum.SCSS.label,
    value: StyleTypeEnum.SCSS.value,
    description: "SASS pre-processor",
  },
  {
    name: StyleTypeEnum.SCSS_MODULE.label,
    value: StyleTypeEnum.SCSS_MODULE.value,
    description: "Scoped SCSS module",
  },
];
module.exports = { StyleTypeEnum, StyleTypeOptions };
