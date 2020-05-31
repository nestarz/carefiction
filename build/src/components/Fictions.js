import {h, Fragment} from "preact";
import {Link} from "wouter-preact";
import {useGunState, useGunSetState} from "./../../../src/utils/gun-hooks.js";
import {byCreateAt, classs} from "./../../../src/utils/utils.js";
import {Text as Text2} from "./../../../src/components/Text.jsx";
import {session} from "./../../../src/App.jsx";
const Image = ({node}) => {
  const [src] = useGunState(node.get("src"));
  return src ? h("img", {
    src
  }) : h(Fragment, null);
};
export default ({node, currentKey}) => {
  const [pages, setPages] = useGunSetState(node.get("pages"));
  const [lock, setLock] = useGunState(node.get(session).get("pages").get("creation").get("lock"));
  const add = () => {
    setPages({
      createdAt: new Date().toISOString(),
      lock: false,
      session
    });
    setLock(true);
  };
  return h(Fragment, null, pages.sort(byCreateAt).map(({key, node: fiction, data}) => {
    const [lock2] = useGunState(fiction.get("title").get("lock"));
    const [current] = useGunState(fiction.get("title").get("current"));
    const [pageSession] = useGunState(fiction.get("session"));
    if (!lock2 && pageSession != session)
      return;
    return h("li", {
      className: classs({
        active: currentKey === key
      })
    }, !lock2 ? h(Text2, {
      node: fiction.get("title"),
      placeholder: "Name your fiction..."
    }) : h(Fragment, null, h(Image, {
      node: fiction.get("image")
    }), h(Link, {
      href: `/fiction/${key}`
    }, current)));
  }), !lock && h("li", {
    className: "add"
  }, h("a", {
    href: "#",
    onClick: add
  }, "Add a new fiction")));
};
