/**
 * This .svg module is quite verbose, but it makes SVGR works. More details:
 * https://stackoverflow.com/questions/54121536/typescript-module-svg-has-no-exported-member-reactcomponent
 * */
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGElement>>;
  const src: string;
  export default src;
}
