import test from "ava";
import {
  pathToRegexp,
  PLAIN,
  PARAM,
  WILDCARD
} from "multi-path-matcher";

function macro(t, path, regex, priority = -1, keys = []) {
  const route = { path };

  const r = pathToRegexp(route);
  t.deepEqual(r.regex, new RegExp(regex));
  if (priority >= 0) {
    t.is(r.priority, priority, "priority");
  }
  t.deepEqual(r.keys, keys, "keys");
}

macro.title = (providedTitle = "", path, expected) =>
  `${providedTitle} ${path} = ${expected}`.trim();

test(macro, "/", "^\\/([\\?#].*)?$", PLAIN * 2);
test(macro, "/index.html", "^\\/index.html([\\?#].*)?$", PLAIN * 2);
test(macro, "/a", "^\\/a([\\?#].*)?$", PLAIN * 2);
test(macro, "/a/b", "^\\/a\\/b([\\?#].*)?$", PLAIN * 3);
test(
  macro,
  "/a/:attr1",
  "^\\/a\\/([^/#?]*)([\\?#].*)?$",
  PLAIN * 2 + PARAM,
  ["attr1"]
);
test(
  macro,
  "/a/:attr1/:attr2",
  "^\\/a\\/([^/#?]*)\\/([^/#?]*)([\\?#].*)?$",
  PLAIN * 2 + PARAM * 2,
  ["attr1", "attr2"]
);
test(
  macro,
  "/a/:attr1/:attr2/b",
  "^\\/a\\/([^/#?]*)\\/([^/#?]*)\\/b([\\?#].*)?$",
  PLAIN * 3 + PARAM * 2,
  ["attr1", "attr2"]
);

test(macro, "*", "^.*([\\?#].*)?$", WILDCARD);
test(macro, "/*", "^\\/.*([\\?#].*)?$", PLAIN + WILDCARD);
test(
  macro,
  "/*/a*2/b*/?c",
  "^\\/.*\\/a.*2\\/b.*\\/.?c([\\?#].*)?$",
  PLAIN + WILDCARD * 4
);
