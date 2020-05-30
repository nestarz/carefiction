import {h, Fragment} from "preact";
import {Route, Router} from "wouter-preact";
import Page2 from "./../../src/components/Page.jsx";
import Pages2 from "./../../src/components/Pages.jsx";
import About2 from "./../../src/components/About.jsx";
import Context2 from "./../../src/components/Context.jsx";
export const session = new Date().toISOString();
export default () => {
  const node = window.Gun({
    peers: ["https://gun.eliasrhouzlane.com/gun", "https://carefiction-gun.herokuapp.com/gun"]
  }).get("alpha-2");
  return h(Router, {
    basepath: location.pathname
  }, h(Route, {
    path: "/"
  }, () => h(Pages2, {
    node: node.get("pages")
  })), h(Route, {
    path: "/about",
    component: About2
  }), h(Route, {
    path: "/fiction/:key"
  }, ({key}) => h(Page2, {
    id: key,
    node: node.get("pages").get(key)
  })), h(Route, {
    path: "/context/:key"
  }, ({key}) => h(Context2, {
    id: key,
    node: node.get("pages").get(key).get("context")
  })));
};
