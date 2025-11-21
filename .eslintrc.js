/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  rules: {
    "@next/next/no-img-element": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react-hooks/rules-of-hooks": "off",
    "react-hooks/exhaustive-deps": "off",
  },
}
