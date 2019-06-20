/**
 * Type definitions for examples/ts-standard
 * */

/** Environment variable exposed by webpack's DefinePlugin, determines
 * whether the built files come from a development build.
 * */
export const DEFINEPLUGIN_DEVMODE: boolean;

/** Environment variable exposed by webpack, determines whether a service
 *  worker JavaScript file is included in the build.
 * */
export const DEFINEPLUGIN_SERVICEWORKER: boolean;
