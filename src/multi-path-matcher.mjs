

/**
  * @typedef CompiledRoutes {object}
 */

/**
 * @typedef Route object
 * @property {string} path
 */

 /**
  * @typedef Match object
  * @property {Route} route
  * @property {object} params
  */

/**
 * compile a set of routes
 * @param {Route} routes[]
 * @return {object}
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
export function match(compiled, path) {
  const params = {};

  return { route: routes.find(r => r.path === path), params };
}
