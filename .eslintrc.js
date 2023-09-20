module.exports = {
    env: {
        node: true,
        jest: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module"
    },
    extends: ["plugin:@typescript-eslint/eslint-plugin","@prettier/@typescript-eslint"],
    rules: []
}