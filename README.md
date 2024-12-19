[![npm](https://img.shields.io/npm/v/multi-path-matcher.svg)](https://www.npmjs.com/package/multi-path-matcher)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://spdx.org/licenses/0BSD.html)
[![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript\&label\&labelColor=blue\&color=555555)](https://typescriptlang.org)
[![bundlejs](https://deno.bundlejs.com/?q=multi-path-matcher\&badge=detailed)](https://bundlejs.com/?q=multi-path-matcher)
[![downloads](http://img.shields.io/npm/dm/multi-path-matcher.svg?style=flat-square)](https://npmjs.org/package/multi-path-matcher)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/multi-path-matcher.svg?style=flat-square)](https://github.com/arlac77/multi-path-matcher/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Farlac77%2Fmulti-path-matcher%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/arlac77/multi-path-matcher/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/multi-path-matcher/badge.svg)](https://snyk.io/test/github/arlac77/multi-path-matcher)
[![Coverage Status](https://coveralls.io/repos/arlac77/multi-path-matcher/badge.svg)](https://coveralls.io/github/arlac77/multi-path-matcher)

# multi-path-matcher

Finds and decodes best matching path in a set of routes

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
matcher(compiled, "/d/value1/e");                 // routes[3] { att1: "value1" }
matcher(compiled, "/d/value1/e/value2?sort=asc"); // routes[2] { att1: "value1", att2: "value2" }
matcher(compiled, "/");                           // routes[4]
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

*   [Route](#route)
    *   [Properties](#properties)
*   [CompiledRoute](#compiledroute)
    *   [Properties](#properties-1)
*   [Match](#match)
    *   [Properties](#properties-2)
*   [PLAIN](#plain)
*   [WILDCARD](#wildcard)
*   [PARAM](#param)
*   [compile](#compile)
    *   [Parameters](#parameters)
*   [pathToRegexp](#pathtoregexp)
    *   [Parameters](#parameters-1)
*   [matcher](#matcher)
    *   [Parameters](#parameters-2)

## Route

One single route

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

## CompiledRoute

Result of a path compilation
priorities for each path component

*   :param       [PARAM](#param)
*   match \* or ? [WILDCARD](#wildcard)
*   plain        [PLAIN](#plain)

Type: [Route](#route)

### Properties

*   `regex` **[RegExp](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp)** for later checking and params extraction
*   `keys` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** all keys found in the route
*   `priority` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** order in which to check

## Match

Result of a match

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

*   `route` **[Route](#route)?** as given to the compiler, undefined if no matching route was found
*   `params` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** extracted from the path

## PLAIN

Prioritiy for a plain path component

Type: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)

## WILDCARD

Prioritiy for a path component with a wildcard '\*'

Type: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)

## PARAM

Prioritiy for a parameter path component

Type: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)

## compile

Compile a set of routes.
All properties of the original routes are preserved

### Parameters

*   `routes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Route](#route)>**&#x20;

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[CompiledRoute](#compiledroute)>**&#x20;

## pathToRegexp

Generate regex with priority.

### Parameters

*   `route` **[Route](#route)**&#x20;

Returns **[CompiledRoute](#compiledroute)**&#x20;

## matcher

Find best match for a given path.
Decodes params into an object.

### Parameters

*   `compiled` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[CompiledRoute](#compiledroute)>**&#x20;
*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

Returns **[Match](#match)** match

# install

With [npm](http://npmjs.org) do:

```shell
npm install multi-path-matcher
```

# license

BSD-2-Clause
