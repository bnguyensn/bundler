const path = require('path');

const babelTransformerPath = path.resolve(__dirname, 'babelTransformer.js');
const svgModuleNameMapperPath = path.resolve(__dirname, '__mocks__/svgMock.js');
const fileModuleNameMapperPath = path.resolve(
  __dirname,
  '__mocks__/fileMock.js',
);
const styleModuleNameMapperPath = path.resolve(
  __dirname,
  '__mocks__/styleMock.js',
);

module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': babelTransformerPath,
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': fileModuleNameMapperPath,
    // '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '\\.svg$': svgModuleNameMapperPath,
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.css$': styleModuleNameMapperPath,
  },
  setupFilesAfterEnv: ['jest-extended'],
};
