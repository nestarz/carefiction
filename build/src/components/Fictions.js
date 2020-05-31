import {h, Fragment} from "preact";
import {Link} from "wouter-preact";
import {useGunState, useGunSetState} from "./../../../src/utils/gun-hooks.js";
import {byCreateAt, classs} from "./../../../src/utils/utils.js";
import {Text as Text2} from "./../../../src/components/Text.jsx";
import {session} from "./../../../src/App.jsx";
export default ({node, currentKey}) => {
  const [pages, setPages] = useGunSetState(node.get("pages"));
  const [lock, setLock] = useGunState(node.get(session).get("pages").get("creation").get("lock"));
  const add = () => {
    setPages({
      createdAt: new Date().toISOString(),
      lock: false
    });
    setLock(true);
  };
  return h("ol", {
    start: "0"
  }, pages.sort(byCreateAt).map(({key, node: fiction}) => {
    const [lock2] = useGunState(fiction.get("title").get("lock"));
    const [current] = useGunState(fiction.get("title").get("current"));
    return h("li", {
      className: classs({
        active: currentKey === key
      })
    }, !lock2 ? h(Text2, {
      node: fiction.get("title"),
      placeholder: "Name your fiction..."
    }) : h(Link, {
      href: `/fiction/${key}`
    }, current));
  }), !lock && h("li", null, h("a", {
    href: "#",
    onClick: add
  }, "Add a new fiction")));
};
