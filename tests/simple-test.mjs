import test from 'ava';
import {compile,match} from '../src/multi-path-matcher.mjs';


const routes = [{ path: "/a/b" }, { path: "/a/b/c" }, { path: "/d/:att1/f" }];
const compiled = compile(routes);




check(routes, "/a/b", routes[0]);
check(routes, "/a/b/c", routes[1]);
check(routes, "/d/x/f", routes[2], { att1: "x" });

function check(routes, path, route, params = {}) {
  const r = matcher(routes, path);

  if (r.route === route && equal(r.params, params)) {
    console.log("OK", path);
  } else {
    console.log("NO OK", path, route, r.route, params, r.params);
  }
}
