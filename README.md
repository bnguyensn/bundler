# Bundler 📦

A single-page React application builder.

## Foreword

This was created to help me learn [webpack](http://webpack.js.org/)
and how to set up a web application up with it (hence the name _bundler_). A
lot of good ideas are lifted from
[create-react-app](https://github.com/facebook/create-react-app).

The recommended way to create a React web application is still
[create-react-app](https://github.com/facebook/create-react-app), which is
supported by the React core team.

## Install

```bash
// Using npm
$ npm i -D @bnguyensn/bundler

// Using yarn
$ yarn add -D @bnguyensn/bundler
```

## Usage (CLI)

A CLI is provided to scaffold an application.

There is only 1 command:

```bash
$ npx @bnguyensn/bundler <app-name> [options]
```

The available options are:

Flag|Shorthand|Description
:---:|:---:|---
`--typescript`|`-ts`|Create a project with TypeScript support


## Usage

Add scripts to run the build process in your `package.json`:

```json
{
  "scripts": {
    "dev": "npx @bnguyensn/bundler dev",
    "prod": "npx @bnguyensn/bundler prod"
  }
}
```

`npx @bnguyensn/bundler dev`: compile the project for development. Will open a
`webpack-dev-server`.

`npx @bnguyensn/bundler prod`: build for production. Will output built files to
a `dist` folder.

## Configuration

Configurations are specified via a `@bnguyensn/bundler` field in the
`package.json` file. See examples in the `examples` folder.

Available configurations are below. Optional fields are marked accordingly. All
paths are from the perspective of the top-level project directory (see
`userDirname` variable in `bin/bundler.js`).

|              Field              |   Type    |    Default     | Description                                                                                                                                                                                                                        |
| :-----------------------------: | :-------: | :------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|           `entryPath`           | `string`  | `src/index.js` | Path to the entry file for webpack. See documentation [here](https://webpack.js.org/concepts/entry-points/). Note that we only support single-page web applications currently.                                                     |
| `htmlWebpackPluginTemplatePath` | `string`  |      `''`      | Path to the HTML template for [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin). This template is used in both development and production mode.                                                               |
| `htmlWebpackPluginFaviconPath?` | `string`  |      `''`      | _(optional)_ Path to the favicon for [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#events). If left empty, a favicon will not be bundled.                                                                  |
|   `pwaManifestTemplatePath?`    | `string`  |      `''`      | _(optional)_ Path to the template for [webpack-pwa-manifest](https://github.com/arthurbergmz/webpack-pwa-manifest)'s options, which can be a JSON or JavaScript file. If left empty, a `manifest.json` file will not be generated. |
|    `serviceWorkerFilePath?`     | `string`  |      `''`      | _(optional)_ Path to the service worker JavaScript file. If left empty, service worker will not be used.                                                                                                                           |
|     `webpackDevServerPort?`     | `number`  |     `8080`     | _(optional)_ Port on which [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server) runs. If left empty, port 8080 will be used.                                                                  |
|        `useTypeScript?`         | `boolean` |    `false`     | _(optional)_ If true, will use appropriate webpack configurations for a TypeScript project.                                                                                                                                        |

## How it works

This package exports the `bundler.js` executable in `bin`.

This executable will do one of the following actions as specified by the user:

- `dev`: start a `webpack-dev-server` for development purpose
- `prod`: bundle files for production using webpack
- `test`: run tests using Jest

## The build

This section explains our configurations.

### webpack 

#### Workbox

[Workbox](https://github.com/GoogleChrome/workbox/releases) is Google's solution
for handling service workers.

Workbox is integrated into our build chain via the `InjectManifest` webpack
plugin. To use it, the user needs to specify the `serviceWorkerFilePath` 
configuration option, which provides Workbox with the service worker file path.
A `service-worker.js` file will then be generated as part of our build process. 

## Gotchas

### TypeScript and CSS modules

You need to create declaration files for each CSS modules files and put them
within the same folder.

## Development

The tool's entry point is `bin/bundler.js`. Start from there.

- `yarn test` or `npm test`: run all tests.

- `yarn server` or `npm server`: start a localhost server to serve
  production-bundled files.

## To-do

### /examples

- Use `typings-for-css-modules-loader`
- Tidy up example folders to demonstrate all capabilities and allow the build
  to pass Lighthouse audits

### index.js

Main webpack config file:

- Investigate why the Google Fonts CDN request fails on page refresh (likely
  due to how the service worker is setup)
- Work through `create-react-app` and bring in more ideas / fixes
