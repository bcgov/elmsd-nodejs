module.exports = {
    extends: ["./rules/base.js", "./js.js", "./jsx.js", "./ts.js", "./tsx.js"].map(require.resolve)
}
