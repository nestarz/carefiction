import {h, Fragment} from "preact";
import {Route, Router} from "wouter-preact";
import Chapter2 from "./../../src/components/Chapter.jsx";
import About2 from "./../../src/components/About.jsx";
import Fiction2 from "./../../src/components/Fiction.jsx";
export const session = new Date().toISOString();
export default () => {
  const node = window.Gun({
    peers: ["https://gun.eliasrhouzlane.com/gun", "https://carefiction-gun.herokuapp.com/gun"]
  }).get("alpha-7");
  return h(Router, {
    basepath: location.pathname
  }, h(Route, {
    path: "/"
  }, () => h(About2, {
    node
  })), h(Route, {
    path: "/fiction/:key"
  }, ({key}) => h(Fiction2, {
    node: node.get("pages").get(key)
  })), h(Route, {
    path: "/fiction/:fiction/chapter/:chapter"
  }, ({fiction, chapter}) => h(Chapter2, {
    id: chapter,
    fiction: node.get("pages").get(fiction),
    chapter: node.get("pages").get(fiction).get("chapters").get(chapter)
  })));
};
