/**
 * Result of the routes compilation
 * @typedef {Object} CompiledRoutes
 */

/**
 * one single route
 * @typedef {Object} Route
 * @property {string} path
 */

/**
 * result of a match
 * @typedef  {Object} Match
 * @property {Route} route as given to the compiler
 * @property {Object} params extracted from the path
 */

/**
 * Compile a set of routes
 * @param {Route[]} routes
 * @return {CompiledRoutes}
 */
export function compile(routes) {
  return routes
    .map(route => {
      return {
        route,
        ...pathToRegexp(route.path)
      };
    })
    .sort((a, b) =>
      a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0
    );
}

export function pathToRegexp(path) {
  const segments = path
    .split(/\//)
    .map(part =>
      part.startsWith(":") ? `(?<${part.substring(1)}>[^\/]*)` : part.replace(/\*/,'.*','g').replace(/\?/,'.?','g')
    );
  const rs = "^" + segments.join("\\/") + '$';
  return { regex: RegExp(rs), priority: segments.length };
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
      return { route: c.route, params: { ...m.groups } };
    }
  }
}
