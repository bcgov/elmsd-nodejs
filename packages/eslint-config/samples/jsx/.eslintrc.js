module.exports = {
    root: true,
    extends: require.resolve("../../lib/jsx.js"),
    rules: {
        "react/react-in-jsx-scope": ["off"]
    }
}
