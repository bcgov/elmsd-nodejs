module.exports = {
    root: true,
    extends: require.resolve("../../lib/index.js"),
    rules: {
        "react/react-in-jsx-scope": ["off"]
    }
}
