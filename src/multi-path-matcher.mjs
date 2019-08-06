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
  return routes;
}

/**
 *
 * @param {CompiledRoutes} compiled
 * @param {string} path
 * @return {Match} match
 */
export function matcher(compiled, path) {
  const params = {};

  return { route: compiled.find(r => r.path === path), params };
}
