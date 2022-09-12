module.exports = {
    extends: require.resolve("./rules/base.js"),
    overrides: [
        {
            extends: require.resolve("./rules/javascript.js"),
            files: ["**/*.js"]
        }
    ]
}
