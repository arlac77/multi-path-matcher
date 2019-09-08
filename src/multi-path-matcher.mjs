/**
 * Result of the routes compilation
 * @typedef {Object} CompiledRoutes
 * @param {number} priority
 * @param {string[]} keys
 * @param {RegEx} regex
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
 * @property {Set<string>} keys all keys found in the route
 * @property {number} priority order in which to check
 */

/**
 * Generate regex with priority
 * @param {string} path
 * @return {CompiledRoute}
 */
export function pathToRegexp(path) {
  const keys = [];

  const segments = path.split(/\//).map(part => {
    if (part.startsWith(":")) {
      const key = part.substring(1);
      keys.push(key);

      return {
        priority: 0,
        part: `(?<${key}>[^\/]*)`
      };
    }

    const mod = part.replace(/\*/, ".*", "g").replace(/\?/, ".?", "g");

    return {
      part: mod,
      priority: mod === part ? 2 : 1
    };
  });
  return {
    keys,
    regex: RegExp("^" + segments.map(s => s.part).join("\\/") + "(\?.*)?$"),
    priority: segments.reduce((a, c) => a + c.priority, 0)
  };
}

/**
 * Find best match for a given path
 * @param {CompiledRoutes} compiled
 * @param {string} path
 * @return {Match} match
 */
export function matcher(compiled, path) {
  for (const c of compiled) {
    const m = path.match(c.regex);
    if (m) {
      return { route: c, params: { ...m.groups } };
    }
  }

  return { params: {} };
}
