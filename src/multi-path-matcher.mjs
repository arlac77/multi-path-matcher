/**
 * Result of the routes compilation
 * @typedef {Object} CompiledRoutes
 * @property {number} priority higher number reflect more precise matches
 * @property {string[]} keys param names extractable from route
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
 * @property {Route[]} route as given to the compiler, undefined if no matching route was found
 * @property {Object} params extracted from the path
 */

/**
 * Prioritiy for a plain path component
 */
export const PLAIN = 100;

/**
 * Prioritiy for a path component with matching
 */
export const MATCH = 10;

/**
 * Prioritiy for a parameter path component
 */
export const PARAM = 1;

/**
 * Compile a set of routes.
 * All properties of the original routes are preserved
 * @param {Route[]} routes
 * @return {CompiledRoutes}
 */
export function compile(routes) {
  return routes
    .map(route => Object.assign(route, pathToRegexp(route.path)))
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Result of a path compilation
 * priorities for each path component
 * - :param       {@link PARAM}
 * - match * or ? {@link MATCH}
 * - plain        {@link PLAIN}
 * @typedef  {Object} CompiledRoute
 * @property {RegExp} regex for later checking and params extraction
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
      keys.push(part.slice(1));
      priority += PARAM;
      return "([^/#?]*)";
    }

    const mod = part.replace(/(\*|\?)/, ".$1", "g");

    priority += mod === part ? PLAIN : MATCH;

    return mod;
  });

  return {
    keys,
    regex: RegExp("^" + segments.join("\\/") + "([\\?#].*)?$"),
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
      return {
        route,
        params: Object.fromEntries(route.keys.map((k, i) => [k, m[i + 1]]))
      };
    }
  }

  return { params: {} };
}
