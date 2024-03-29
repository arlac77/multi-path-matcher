import test from "ava";
import { compile, matcher } from "multi-path-matcher";

function macro(t, routes, path, route, params = {}) {
  const compiled = compile(routes);
  const result = matcher(compiled, path);
  t.deepEqual(
    result,
    result.route ? { route: routes[route], params } : { params }
  ,path);
}

macro.title = (providedTitle = "", routes, path, route) =>
  `${providedTitle} ${path} = ${routes[route]?.path || "undefined"}`.trim();

const routes = [
  { path: "/a/b/c" },
  { path: "/a/b" },
  { path: "/d/:att1/e/:att2" },
  { path: "/d/:att1/e" },
  { path: "/d/x/e" }, // higher prio than with attribute
  { path: "/" },
  { path: "/:k1/:k2/:k3" }
];

test("all keys", t => {
  compile(routes);
  t.deepEqual(
    routes.reduce((a, c) => new Set([...c.keys, ...a]), new Set()),
    new Set(["k1", "k2", "k3", "att1", "att2"])
  );
});

test(macro, routes, "/a", -1);
test(macro, routes, "/a/b?p=1&q=2", 1);
test(macro, routes, "/a/b#frag", 1);
test(macro, routes, "/a/b/c", 0);
test(macro, routes, "/u/v/w", 6, { k1: "u", k2: "v", k3: "w" });
test(macro, routes, "/d/value1/e", 3, { att1: "value1" });
test(macro, routes, "/d/" + encodeURIComponent("value/with/slash") + "/e", 3, { att1: "value/with/slash" });
test(macro, routes, "/d/value1/e?p=1", 3, { att1: "value1" });
test(macro, routes, "/d/ with space /e", 3, {
  att1: " with space "
});

test(macro, routes, "/d/value1/e/value2", 2, {
  att1: "value1",
  att2: "value2"
});
test(macro, routes, "/d/value1/e/value2#frag", 2, {
  att1: "value1",
  att2: "value2"
});
test(macro, routes, "/d/value1/e/value2?p=1", 2, {
  att1: "value1",
  att2: "value2"
});
test(macro, routes, "/d/value1/e/value2?p=1#frag", 2, {
  att1: "value1",
  att2: "value2"
});

test(macro, routes, "/d/x/e", 4);
test(macro, routes, "/", 5);

const routes2 = [
  { path: "/a/b*" },
  { path: "*" },
  { path: "/pre*/a" },
  { path: "/" }
];

test("wildcard", macro, routes2, "/a/b", 0);
test("wildcard", macro, routes2, "/a/bxxx", 0);
test("wildcard", macro, routes2, "/unknown", 1);
test("wildcard", macro, routes2, "/deeper/unknown", 1);
test("wildcard", macro, routes2, "/preXXX/a", 2);
test("wildcard", macro, routes2, "/prXXX/a", 1);

const routes3 = [
  { path: "/" },
  { path: "/*" },
  { path: "/about" },
  { path: "/login" }
];

test("priority-match", macro, routes3, "/", 0);
test("priority-match", macro, routes3, "/index.html", 1);
test("priority-match", macro, routes3, "/about", 2);
test("priority-match", macro, routes3, "/login", 3);

const routes4 = [
  { path: "/article" },
  { path: "/article/:article" },
  { path: "/article/orders" }
];

test("priority-match-2", macro, routes4, "/artice", 0);
test("priority-match-2", macro, routes4, "/article/0001", 1, {
  article: "0001"
});
test("priority-match-2", macro, routes4, "/article/orders", 2);

const routes5 = [{ path: "#article" }, { path: "#article/:article" }];

test("hash-match-1", macro, routes5, "#article", 0);
test("hash-match-1", macro, routes5, "#article/1", 1, { article: "1" });
test("hash-match-1", macro, routes5, "#article/abc", 1, { article: "abc" });
