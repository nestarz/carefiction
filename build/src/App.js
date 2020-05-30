import React from "react";
import {Route, Router} from "wouter";
import Page2 from "./../../src/components/Page.jsx";
import Pages2 from "./../../src/components/Pages.jsx";
import About2 from "./../../src/components/About.jsx";
import Context2 from "./../../src/components/Context.jsx";
export const session = new Date().toISOString();
export default () => {
  const node = window.Gun({
    peers: ["https://gun.eliasrhouzlane.com/gun", "https://carefiction-gun.herokuapp.com/gun"]
  }).get("alpha-2");
  return React.createElement(Router, {
    basepath: location.pathname
  }, React.createElement(Route, {
    path: "/"
  }, () => React.createElement(Pages2, {
    node: node.get("pages")
  })), React.createElement(Route, {
    path: "/about",
    component: About2
  }), React.createElement(Route, {
    path: "/fiction/:key"
  }, ({key}) => React.createElement(Page2, {
    id: key,
    node: node.get("pages").get(key)
  })), React.createElement(Route, {
    path: "/context/:key"
  }, ({key}) => React.createElement(Context2, {
    id: key,
    node: node.get("pages").get(key).get("context")
  })));
};
