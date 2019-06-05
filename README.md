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

Create a `@bnguyensn/bundler` section in your `package.json`:

```json
{
  "@bnguyensn/bundler": {
    // Default values are shown below
    "entry": "src/index.js",
    "output": "dist/static",
    "output_html": "../index.html"
  }
}
```

## How it works

The package exports the `bundler.js` executable in `bin`.

This executable, when runs, will either start a `webpack-dev-server` for development or build a production build using configurations from:
 
* The executable itself
* The package's `index.js` (the package's webpack configuration file)
* The user's `package.json`

## Development

* `yarn test` or `npm test`: run all tests.

* `yarn dev` or `npm dev`: start a development run.

* `yarn prod` or `npm prod`: start a production build. Note that the process will create a `node_modules/.cache/terser-webpack-plugin` folder in the relevant example folder. This just is `terser-webpack-plugin` caching its build results to improve build performance.

* `yarn server` or `npm server`: start a localhost server to serve production-bundled files.

The tool's entry point is in `bin/bundler.js`. Start from there.

## To-do

N/A
