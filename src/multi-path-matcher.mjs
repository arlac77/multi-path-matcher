/**
 * Result of the routes compilation
 * @typedef {Object} CompiledRoutes
 * @property {number} priority higher number reflect more precise matches
 * @property {string[]} keys param names
 * @property {RegEx} regex
 */

/**
 * One single route
 * @typedef {Object} Route
 * @property {string} path
 */

/**
 * Result of a match
 * @typedef  {Object} Match
 * @property {Route} [route] as given to the compiler, undefined if no matching route found
 * @property {Object} params extracted from the path
 */

/**
 * Compile a set of routes
 * @param {Route[]} routes
 * @return {CompiledRoutes}
 */
export function compile(routes) {
  return routes
    .map(route => Object.assign(route, pathToRegexp(route.path)))
    .sort((a, b) =>
      a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0
    );
}

/**
 * Result of a path compilation
 * priorities for each path component
 * - :param       -> 0
 * - match * or ? -> 1
 * - plain        -> 2
 * @typedef  {Object} CompiledRoute
 * @property {RegExp} regex for later checking and params extration
 * @property {string[]} keys all keys found in the route
 * @property {number} priority order in which to check
 */

/**
 * Generate regex with priority
 * @param {string} path
 * @return {CompiledRoute}
 */
export function pathToRegexp(path) {
  const keys = [];
  let priority = 0;

  const segments = path.split(/\//).map(part => {
    if (part[0] === ":") {
      const key = part.slice(1);
      keys.push(key);

      return `(?<${key}>[^\/]*)`;
    }

    const mod = part.replace(/(\*|\?)/, ".$1", "g");

    priority += mod === part ? 2 : 1;

    return mod;
  });

  return {
    keys,
    regex: RegExp("^" + segments.join("\\/") + "(\\?.*)?$"),
    priority
  };
}

/**
 * Find best match for a given path
 * @param {CompiledRoutes} compiled
 * @param {string} path
 * @return {Match} match
 */
export function matcher(compiled, path) {
  for (const route of compiled) {
    const m = path.match(route.regex);
    if (m) {
      return { route, params: { ...m.groups } };
    }
  }

  return { params: {} };
}
