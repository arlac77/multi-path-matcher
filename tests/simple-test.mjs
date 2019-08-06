import test from "ava";
import { compile, matcher } from "../src/multi-path-matcher.mjs";

function macro(t, routes, path, route, params = {}) {
  const compiled = compile(routes);
  const result = matcher(compiled, path);

  t.deepEqual(result, { route, params });
}

macro.title = (providedTitle = "", routes, input, expected) =>
  `${providedTitle} ${input} = ${expected}`.trim();

const routes = [
    { path: "/a/b" },
    { path: "/a/b/c" },
    { path: "/d/:att1/f" }
];

test(macro, routes, "/a/b", routes[0]);
test(macro, routes, "/a/b/c", routes[1]);

//test(macro, routes, "/d/value1/e", routes[2], { att1: 'value1' });
