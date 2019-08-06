import test from "ava";
import { compile, matcher } from "../src/multi-path-matcher.mjs";

function macro(t, routes, path, route, params = {}) {
  const compiled = compile(routes);
  const result = matcher(compiled, path);

  t.deepEqual(result, result ? { route, params } : undefined);
}

macro.title = (providedTitle = "", routes, path, expected) =>
  `${providedTitle} ${path} = ${expected ? expected.path : 'undefined'}`.trim();

const routes = [
  { path: "/a/b/c" },
  { path: "/a/b" },
  { path: "/d/:att1/e/:att2" },
  { path: "/d/:att1/e" },
  { path: "/" }
];


test(macro, routes, "/a", undefined);
test(macro, routes, "/a/b", routes[1]);
test(macro, routes, "/a/b/c", routes[0]);
test(macro, routes, "/d/value1/e", routes[3], { att1: "value1" });
test(macro, routes, "/d/value1/e/value2", routes[2], { att1: "value1", att2: "value2"  });
test(macro, routes, "/", routes[4]);
