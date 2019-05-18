# Bundler

A standard bundler for my web apps.

### Usage

Add scripts to run the build process via `package.json`:

```json
{
  "scripts": {
    "dev": "npx @bnguyensn/bundler dev",
    "prod": "npx @bnguyensn/bundler prod"
  }
}
```

`dev`: build for development. Will open a `webpack-dev-server`.

`prod`: build for production.

### Development

`test` does nothing...yet

`test:dev` test a dev run

`test:prod` test a production build
