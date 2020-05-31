import {h, Fragment} from "preact";
import {Link} from "wouter-preact";
import {useGunSetState, useGunState} from "./../../../src/utils/gun-hooks.js";
import {byCreateAt} from "./../../../src/utils/utils.js";
import {session} from "./../../../src/App.jsx";
import {Text as Text2} from "./../../../src/components/Text.jsx";
export default ({node}) => {
  const [chapters, setChapters] = useGunSetState(node.get("chapters"));
  const [lock, setLock] = useGunState(node.get(session).get("chapters").get("creation").get("lock"));
  const add = () => {
    setChapters({
      createdAt: new Date().toISOString(),
      lock: false
    });
    setLock(true);
  };
  return h("ol", {
    start: "0"
  }, h("li", null, h(Link, {
    href: "/"
  }, "Intro")), chapters.sort(byCreateAt).map(({key, node: chapter}) => {
    const [lock2] = useGunState(chapter.get("subtitle").get("lock"));
    const [current] = useGunState(chapter.get("subtitle").get("current"));
    return h("li", null, !lock2 ? h(Text2, {
      node: chapter.get("subtitle"),
      placeholder: "Name your chapter..."
    }) : h(Link, {
      href: `/fiction/${node._.get}/chapter/${key}`
    }, current));
  }), !lock && h("li", null, h("a", {
    href: "#",
    onClick: add
  }, "Add a new chapter")));
};
