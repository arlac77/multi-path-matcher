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

/**
 * result of a path compilation
 * priorities for each path component
 * - :param        -> 0
 * - match * or ?  -> 1
 * - literal       -> 2
 * @typedef  {Object} CompiledRoute
 * @property {RegExp} regex for later checking and params extration
 * @property {number} priority order in which to check
 */

/**
 * Generate as regex with priority
 * @param {string} path 
 * @return {CompiledRoute} 
 */
export function pathToRegexp(path) {
  const segments = path
    .split(/\//)
    .map(part =>
      {
        let priority = 0;

        if(part.startsWith(":")) {
          part = `(?<${part.substring(1)}>[^\/]*)`;
        }
        else {
          const mod = part.replace(/\*/,'.*','g').replace(/\?/,'.?','g');
          priority = mod === part ? 2 : 1;
          part = mod;
        }

        return {
          part,
          priority
        };
      }
    );
  const rs = "^" + segments.map(s => s.part).join("\\/") + '$';
  return { regex: RegExp(rs), priority: segments.reduce( (a,c) => a + c.priority, 0) };
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
