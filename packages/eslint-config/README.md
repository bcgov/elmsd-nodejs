# @bcgov-elmsd/eslint-config

A modern [ESLint](https://eslint.org) configuration for [JavaScript](https://ecma-international.org/publications-and-standards/standards/ecma-262), [TypeScript](https://www.typescriptlang.org) and [React](https://reactjs.org) which includes the [Airbnb style guide](https://github.com/airbnb/javascript), [jsx-a11y]() and [Prettier](https://www.npmjs.com/package/eslint-plugin-prettier).

## A bit of context

It's always a bit time consuming to create or maintain different [ESlint](https://eslint.org/) configurations that works with different languages and libraries such as [TypeScript](https://www.typescriptlang.org/) and [React](https://reactjs.org/). The goal of this package is to have different configurations that just work out-of-the-box and that are constantly kept up-to-date.

## Getting Started

Installing this package is has as easy has any other packages. Simply use your favorite package manager. You'll need to install the required peer dependencies and than this package.

### Install ESlint and Prettier peer dependencies

Install [ESlint](https://eslint.org/) and [Prettier](https://prettier.io/).

```sh
npm install eslint@8 --save-dev
npm install prettier@2 --save-dev --save-exact
```

If you use [TypeScript](https://www.typescriptlang.org/) or [React](https://reactjs.org/) you'll also need to install them, but let's assume they're already installed. Have a look at the `peerDependencies` field in the package.json to know which one we support.

### Install @bcgov-elmsd/eslint-config

```sh
npm install @bcgov-elmsd/eslint-config --save-dev
```

### Setup the configuration file

Using the [JavaScript file format](https://eslint.org/docs/user-guide/configuring/ßconfiguration-files#configuration-file-formats) supported by [ESlint](https://eslint.org/), you'll need to add `"@bcgov-elmsd/eslint-config"` in the `"extends"` value of the configuration. Here's an example using a `.eslintrc.js` file.

#### Using the full configuration with JavaScript, TypeScript and React

```js
module.exports = {
    extends: ["@bcgov-elmsd/eslint-config"]
}
```

#### JavaScript config

```js
module.exports = {
    extends: ["@bcgov-elmsd/eslint-config/js"]
}
```

#### JavaScript with React config

```js
module.exports = {
    extends: ["@bcgov-elmsd/eslint-config/js", "@bcgov-elmsd/eslint-config/jsx"]
}
```

#### TypeScript config

```js
module.exports = {
    extends: ["@bcgov-elmsd/eslint-config/ts"]
}
```

#### TypeScript with React config

```js
module.exports = {
    extends: ["@bcgov-elmsd/eslint-config/ts", "@bcgov-elmsd/eslint-config/tsx"]
}
```

### Enhance configuration file (optional)

To add custom [Prettier](https://prettier.io/) rules to the mix, create a `.prettierrc.js` file with the following content. See a list of [supported options](https://prettier.io/docs/en/options.html) should the following not work for you.

```js
module.exports = {
    printWidth: 150,
    semi: false,
    singleQuote: false,
    tabWidth: 4,
    useTabs: false,
    trailingComma: "none"
}
```

To see errors when code does not conform to your Prettier config, add the following to your `.eslintrc.js` file.

```js
const prettierConfig = require("./.prettierrc")

module.exports = {
    ...
    rules: {
        "prettier/prettier": ["error", prettierConfig]
    }
}
```

Voilà! Your project now uses a linter.

## References

_Heavily_ inspired by [eslint-config-100terres](https://github.com/100terres/eslint-config).

## License

```
Copyright 2022 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
