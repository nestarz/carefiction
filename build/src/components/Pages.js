import {h, Fragment} from "preact";
import {Link} from "wouter-preact";
import {useGunSetState} from "./../../../src/utils/gun-hooks.js";
import {byCreateAt} from "./../../../src/utils/utils.js";
export default ({node}) => {
  const [pages, setPages] = useGunSetState(node.get("pages"));
  const add = () => setPages({
    createdAt: new Date().toISOString(),
    lock: false
  });
  return h(Fragment, null, h("button", {
    onClick: add
  }, "Add A New Fiction"), pages.sort(byCreateAt).map(({key}) => h(Link, {
    href: `/fiction/${key}`
  }, h("a", null, key))));
};
