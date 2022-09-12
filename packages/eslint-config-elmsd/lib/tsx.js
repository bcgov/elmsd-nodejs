module.exports = {
    extends: require.resolve("./rules/base.js"),
    overrides: [
        {
            extends: ["./rules/javascript.js", "./rules/react.js", "./rules/typescript.js"].map(require.resolve),
            files: ["**/*.tsx"]
        }
    ]
}
