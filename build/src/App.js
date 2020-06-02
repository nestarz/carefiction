import {h, Fragment} from "preact";
import {Route, Router, Switch} from "wouter-preact";
import {useGun} from "./../../src/utils/gun-hooks.js";
export const session = new Date().toISOString();
import Fiction2 from "./../../src/components/Fiction.jsx";
export default () => {
  const node = useGun({
    peers: ["https://gun.eliasrhouzlane.com/gun", "https://carefiction-gun.herokuapp.com/gun"],
    root: "table-carefiction-1"
  });
  return h(Router, {
    basepath: location.pathname
  }, h(Switch, null, h(Route, {
    path: "/fiction/:fictionKey/chapter/:chapterKey/"
  }, ({fictionKey, chapterKey}) => h(Fiction2, {
    parent: node.get("chapters").get(fictionKey),
    node: node.get("chapters").get(fictionKey).get("chapters").get(chapterKey)
  })), h(Route, {
    path: "/fiction/:fictionKey/"
  }, ({fictionKey}) => h(Fiction2, {
    parent: node.get("chapters").get(fictionKey),
    node: node.get("chapters").get(fictionKey).get("chapters").get("Intro")
  })), h(Route, {
    path: "/:rest*"
  }, () => h(Fiction2, {
    node
  }))));
};
