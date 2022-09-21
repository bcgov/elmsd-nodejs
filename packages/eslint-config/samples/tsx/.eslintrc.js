module.exports = {
    root: true,
    extends: require.resolve("../../lib/tsx.js"),
    rules: {
        "react/react-in-jsx-scope": ["off"]
    }
}
