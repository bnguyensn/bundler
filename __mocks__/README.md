# mocks

Information on `__mocks__` folders: https://jestjs.io/docs/en/manual-mocks

The main purpose of this one is to allow Jest to handle images and stylesheets:

- https://jestjs.io/docs/en/webpack#handling-static-assets
- https://jestjs.io/docs/en/webpack#mocking-css-modules

### Notes on SVGs

- We load SVG files using [SVGR](https://github.com/smooth-code/svgr). These
  components will throw render errors in Jest snapshot tests. This is 
  remedied by
  the `svgMock.js` file (you'll also need to map SVG file imports to this file
  via the `moduleNameMapper` Jest config \- check out our top-level `package
  .json`). See 
  details on this error [here](https://github.com/smooth-code/svgr/issues/83#issuecomment-469538599).
 
