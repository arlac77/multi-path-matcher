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
 * @property {Route} route
 * @property {Object} params
 */

/**
 * compile a set of routes
 * @param {Route[]} routes
 * @return {Object}
 */
export function compile(routes) {
  return routes.map(route => {
    return {
      route,
      regex: pathToRegexp(route.path)
    };
  });
}

export function pathToRegexp(path) {
  const segments = path
    .split(/\//)
    .map(part =>
      part.startsWith(":") ? `(?<${part.substring(1)}>[^\/]*)` : part
    );
  const rs = "^" + segments.join("\\/");
  return RegExp(rs);
}

/**
 *
 * @param {CompiledRoutes} compiled
 * @param {string} path
 * @return {Match} match
 */
export function matcher(compiled, path) {

  for(const c of compiled) {
    const m = path.match(c.regex);
    if(m) {
      return { route: c.route, params : {...m.groups} };
    }
  }
}
