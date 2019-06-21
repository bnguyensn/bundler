# Bundler

A standard build tool for my single-page web applications.

## Install

```bash
// Using npm
npm i -D @bnguyensn/bundler

// Using yarn
yarn add -D @bnguyensn/bundler
```

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

`npx @bnguyensn/bundler dev`: build for development. Will open a `webpack-dev-server`.

`npx @bnguyensn/bundler prod`: build for production.

## Configuration

Configurations are specified via a `@bnguyensn/bundler` field in the `package.json` file. See examples in the `examples` folder. 

Available configurations are below. Optional fields are marked accordingly. All paths are from the perspective of the top-level project directory (see `userDirname` variable in `bin/bundler.js`).

Field | Type | Default | Description
:---: | :---: | :---: | ---
`entryPath` | `string` | `src/index.js` | Path to the entry file for webpack. See documentation [here](https://webpack.js.org/concepts/entry-points/). Note that we only support single-page web applications currently.
`htmlWebpackPluginTemplatePath` | `string` | `''` | Path to the HTML template for [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin). This template is used in both development and production mode.
`htmlWebpackPluginFaviconPath?` | `string` | `''` | *(optional)* Path to the favicon for [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#events). If left empty, a favicon will not be bundled.
`pwaManifestTemplatePath?` | `string` | `''` | *(optional)* Path to the template for [webpack-pwa-manifest](https://github.com/arthurbergmz/webpack-pwa-manifest)'s options, which can be a JSON or JavaScript file. If left empty, a `manifest.json` file will not be generated.
`serviceWorkerFilePath?` | `string` | `''` | *(optional)* Path to the service worker JavaScript file. If left empty, service worker will not be used.
`webpackDevServerPort?` | `number` | `8080` | *(optional)* Port on which [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server) runs. If left empty, port 8080 will be used.
`useTypeScript?` | `boolean` | `false` | *(optional)* If true, will use appropriate webpack configurations for a TypeScript project. 
 

## How it works

This package exports the `bundler.js` executable in `bin`.

This executable, when runs, will either start a `webpack-dev-server` for development or build a production build using configurations from:
 
* The executable itself
* The package's `index.js` (the package's webpack configuration file)
* The user's `package.json`

## What your project should look like?

## Gotchas

### TypeScript and CSS modules

You need to create declaration files for each CSS modules files and put them 
within the same folder.

## Development

* `yarn test` or `npm test`: run all tests.

* `yarn dev` or `npm dev`: start a development run.

* `yarn prod` or `npm prod`: start a production build. Note that the process will create a `node_modules/.cache/terser-webpack-plugin` folder in the relevant example folder. This is just `terser-webpack-plugin` caching its build results to improve build performance.

* `yarn server` or `npm server`: start a localhost server to serve production-bundled files.

The tool's entry point is in `bin/bundler.js`. Start from there.

## To-do

### /examples

* Use `typings-for-css-modules-loader`
* Tidy up example folders to demonstrate all capabilities and allow the build
to pass Lighthouse audits

### index.js

Main webpack config file:
* Investigate why the Google Fonts CDN request fails on page refresh (likely 
due to how the service worker is setup)
* Work through `create-react-app` and bring in more ideas / fixes
