import test from "ava";
import { pathToRegexp } from "../src/multi-path-matcher.mjs";

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

test(macro, "/", "^\\/(\\?.*)?$", 4);
test(macro, "/index.html", "^\\/index.html(\\?.*)?$", 4);
test(macro, "/a", "^\\/a(\\?.*)?$", 4);
test(macro, "/a/b", "^\\/a\\/b(\\?.*)?$", 6);
test(macro, "/a/:attr1", "^\\/a\\/(?<attr1>[^/]*)(\\?.*)?$", 4, ["attr1"]);
test(
  macro,
  "/a/:attr1/:attr2",
  "^\\/a\\/(?<attr1>[^/]*)\\/(?<attr2>[^/]*)(\\?.*)?$",
  4,
  ["attr1", "attr2"]
);
test(
  macro,
  "/a/:attr1/:attr2/b",
  "^\\/a\\/(?<attr1>[^/]*)\\/(?<attr2>[^/]*)\\/b(\\?.*)?$",
  6,
  ["attr1", "attr2"]
);

test(macro, "*", "^.*(\\?.*)?$", 1);
test(macro, "/*", "^\\/.*(\\?.*)?$", 3);
test(macro, "/*/a*2/b*/?c", "^\\/.*\\/a.*2\\/b.*\\/.?c(\\?.*)?$", 6);
