# SWPlugin

## Description

This plugin:

* Locate the service worker JavaScript file
* Inject the precache manifest array into the service worker JavaScript file

## Why?

Currently Google Workbox's `InjectManifest` plugin result does not get transpiled by webpack ([issue#1513](https://github.com/GoogleChrome/workbox/issues/1513)).

This means that integration with the current bundler codebase is tricky.

Until this is [fixed in Workbox 5](https://github.com/GoogleChrome/workbox/issues/1854), this SWPlugin will be used to generate the service worker file for our build outputs.
