import test from "ava";
import { pathToRegexp } from "../src/multi-path-matcher.mjs";

function macro(t, path, regex) {
  t.deepEqual(pathToRegexp(path), new RegExp(regex));
}

macro.title = (providedTitle = "", path, expected) =>
  `${providedTitle} ${path} = ${expected}`.trim();

  test(macro, "/a", "^\\/a");
  test(macro, "/a/b", "^\\/a\\/b");
  test(macro, "/a/:attr1", "^\\/a\\/(?<attr1>[^\/]*)");
  test(macro, "/a/:attr1/:attr2", "^\\/a\\/(?<attr1>[^\/]*)\\/(?<attr2>[^\/]*)");
  test(macro, "/a/:attr1/:attr2/b", "^\\/a\\/(?<attr1>[^\/]*)\\/(?<attr2>[^\/]*)\\/b");
