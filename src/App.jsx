/* @jsx h */
import { h, Fragment } from "preact";
import { Route, Router, Switch } from "wouter-preact";
import { useGun } from "./utils/gun-hooks.js";

export const session = new Date().toISOString();

import Fiction from "./components/Fiction.jsx";

export default () => {
  const node = useGun({
    peers: [
      "https://gun.eliasrhouzlane.com/gun",
      "https://carefiction-gun.herokuapp.com/gun",
    ],
    root: "table-carefiction-2",
  });

  return (
    <Router basepath={location.pathname}>
      <Switch>
        <Route path="/fiction/:fictionKey/chapter/:chapterKey/">
          {({ fictionKey, chapterKey }) => (
            <Fiction
              parent={node.get("chapters").get(fictionKey)}
              node={node
                .get("chapters")
                .get(fictionKey)
                .get("chapters")
                .get(chapterKey)}
            />
          )}
        </Route>
        <Route path="/fiction/:fictionKey/">
          {({ fictionKey }) => (
            <Fiction
              parent={node.get("chapters").get(fictionKey)}
              node={node
                .get("chapters")
                .get(fictionKey)
                .get("chapters")
                .get("Intro")}
            />
          )}
        </Route>
        <Route path="/:rest*">{() => <Fiction node={node} />}</Route>
      </Switch>
    </Router>
  );
};
