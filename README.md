[![npm](https://img.shields.io/npm/v/multi-path-matcher.svg)](https://www.npmjs.com/package/multi-path-matcher)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/multi-path-matcher)](https://bundlephobia.com/result?p=multi-path-matcher)
[![downloads](http://img.shields.io/npm/dm/multi-path-matcher.svg?style=flat-square)](https://npmjs.org/package/multi-path-matcher)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/multi-path-matcher.svg?style=flat-square)](https://github.com/arlac77/multi-path-matcher/issues)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/multi-path-matcher.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/multi-path-matcher)
[![Build Status](https://secure.travis-ci.org/arlac77/multi-path-matcher.png)](http://travis-ci.org/arlac77/multi-path-matcher)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/multi-path-matcher/badge.svg)](https://snyk.io/test/github/arlac77/multi-path-matcher)

# multi-path-matcher

finds and decodes best matching path in a set of routes

# usage

With params

```js
import { compile, matcher } from "multi-path-matcher";

const routes = [
  { path: "/a/b/c" },
  { path: "/a/b" },
  { path: "/d/:att1/e/:att2" },
  { path: "/d/:att1/e" },
  { path: "/" }
];

const compiled = compile(routes);

matcher(compiled "/a");                   // undefined
matcher(compiled, "/a/b");                // routes[1]
matcher(compiled, "/a/b/c");              // routes[0]
matcher(compiled, "/d/value1/e");         // routes[3] { att1: "value1" }
matcher(compiled, "/d/value1/e/value2");  // routes[2] { att1: "value1", att2: "value2" }
matcher(compiled, "/");                   // routes[4]
```

With wildcards

```js
import { compile, matcher } from "multi-path-matcher";

const routes = [
  { path: "/" },
  { path: "/*" },
  { path: "/about" },
  { path: "/login" }
];

const compiled = compile(routes);

matcher(compiled, "/");                   // routes[0]
matcher(compiled, "/index.html");         // routes[1]
matcher(compiled, "/about");              // routes[2]
matcher(compiled, "/login?param=1");      // routes[3]
```

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [CompiledRoutes](#compiledroutes)
    -   [Properties](#properties)
-   [Route](#route)
    -   [Properties](#properties-1)
-   [Match](#match)
    -   [Properties](#properties-2)
-   [compile](#compile)
    -   [Parameters](#parameters)
-   [CompiledRoute](#compiledroute)
    -   [Properties](#properties-3)
-   [pathToRegexp](#pathtoregexp)
    -   [Parameters](#parameters-1)
-   [matcher](#matcher)
    -   [Parameters](#parameters-2)

## CompiledRoutes

Result of the routes compilation

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

-   `priority` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** higher number reflect more precise matches
-   `keys` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** param names
-   `regex` **RegEx** 

## Route

One single route

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## Match

Result of a match

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

-   `route` **[Route](#route)?** as given to the compiler, undefined if no matching route found
-   `params` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** extracted from the path

## compile

Compile a set of routes

### Parameters

-   `routes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Route](#route)>** 

Returns **[CompiledRoutes](#compiledroutes)** 

## CompiledRoute

Result of a path compilation
priorities for each path component

-   :param       -> 0
-   match \* or ? -> 1
-   plain        -> 2

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

-   `regex` **[RegExp](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp)** for later checking and params extration
-   `keys` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** all keys found in the route
-   `priority` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** order in which to check

## pathToRegexp

Generate regex with priority

### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[CompiledRoute](#compiledroute)** 

## matcher

Find best match for a given path

### Parameters

-   `compiled` **[CompiledRoutes](#compiledroutes)** 
-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Match](#match)** match

# install

With [npm](http://npmjs.org) do:

```shell
npm install multi-path-matcher
```

# license

BSD-2-Clause
