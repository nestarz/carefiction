import {h, Fragment} from "preact";
import {Route, Router} from "wouter-preact";
import {useGun} from "./../../src/utils/gun-hooks.js";
export const session = new Date().toISOString();
import Fiction2 from "./../../src/components/Fiction.jsx";
export default () => {
  const node = useGun({
    peers: ["https://gun.eliasrhouzlane.com/gun", "https://carefiction-gun.herokuapp.com/gun"],
    root: "alpha-18"
  });
  return h(Router, {
    basepath: location.pathname
  }, h(Route, {
    path: "/"
  }, () => h(Fiction2, {
    node,
    fictionKey: "hello"
  })), h(Route, {
    path: "/fiction/:fictionKey"
  }, ({fictionKey}) => h(Fiction2, {
    node,
    fictionKey,
    chapterKey: "Intro"
  })), h(Route, {
    path: "/fiction/:fictionKey/chapter/:chapterKey"
  }, ({fictionKey, chapterKey}) => h(Fiction2, {
    node,
    fictionKey,
    chapterKey
  })));
};
