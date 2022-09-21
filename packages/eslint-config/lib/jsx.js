module.exports = {
    extends: require.resolve("./rules/base.js"),
    overrides: [
        {
            extends: ["./rules/javascript.js", "./rules/react.js"].map(require.resolve),
            files: ["**/*.jsx"]
        }
    ]
}
