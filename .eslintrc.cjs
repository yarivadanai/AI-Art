module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  rules: {
    "@next/next/no-img-element": "off",
  },
  ignorePatterns: [".next/", "dist/", "coverage/", "node_modules/"],
};
