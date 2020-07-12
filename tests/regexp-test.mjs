import test from "ava";
import {
  pathToRegexp,
  PRIORITY_PLAIN,
  PRIORITY_PARAM,
  PRIORITY_MATCH
} from "multi-path-matcher";

function macro(t, path, regex, priority = -1, keys = []) {
  const r = pathToRegexp(path);
  t.deepEqual(r.regex, new RegExp(regex));
  if (priority >= 0) {
    t.is(r.priority, priority, "priority");
  }
  t.deepEqual(r.keys, keys, "keys");
}

macro.title = (providedTitle = "", path, expected) =>
  `${providedTitle} ${path} = ${expected}`.trim();

test(macro, "/", "^\\/([\\?#].*)?$", PRIORITY_PLAIN * 2);
test(macro, "/index.html", "^\\/index.html([\\?#].*)?$", PRIORITY_PLAIN * 2);
test(macro, "/a", "^\\/a([\\?#].*)?$", PRIORITY_PLAIN * 2);
test(macro, "/a/b", "^\\/a\\/b([\\?#].*)?$", PRIORITY_PLAIN * 3);
test(
  macro,
  "/a/:attr1",
  "^\\/a\\/([^/#?]*)([\\?#].*)?$",
  PRIORITY_PLAIN * 2 + PRIORITY_PARAM,
  ["attr1"]
);
test(
  macro,
  "/a/:attr1/:attr2",
  "^\\/a\\/([^/#?]*)\\/([^/#?]*)([\\?#].*)?$",
  PRIORITY_PLAIN * 2 + PRIORITY_PARAM * 2,
  ["attr1", "attr2"]
);
test(
  macro,
  "/a/:attr1/:attr2/b",
  "^\\/a\\/([^/#?]*)\\/([^/#?]*)\\/b([\\?#].*)?$",
  PRIORITY_PLAIN * 3 + PRIORITY_PARAM * 2,
  ["attr1", "attr2"]
);

test(macro, "*", "^.*([\\?#].*)?$", PRIORITY_MATCH);
test(macro, "/*", "^\\/.*([\\?#].*)?$", PRIORITY_PLAIN + PRIORITY_MATCH);
test(
  macro,
  "/*/a*2/b*/?c",
  "^\\/.*\\/a.*2\\/b.*\\/.?c([\\?#].*)?$",
  PRIORITY_PLAIN + PRIORITY_MATCH * 4
);
