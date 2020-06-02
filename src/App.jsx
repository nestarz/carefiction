/* @jsx h */
import { h, Fragment } from "preact";
import { Route, Router } from "wouter-preact";
import { useGun } from "./utils/gun-hooks.js";

export const session = new Date().toISOString();

import Fiction from "./components/Fiction.jsx";

export default () => {
  const node = useGun({
    peers: [
      "https://gun.eliasrhouzlane.com/gun",
      "https://carefiction-gun.herokuapp.com/gun",
    ],
    root: "alpha-18",
  });

  return (
    <Router basepath={location.pathname}>
      <Route path="/">{() => <Fiction node={node} fictionKey="hello" />}</Route>
      <Route path="/fiction/:fictionKey">
        {({ fictionKey }) => (
          <Fiction node={node} fictionKey={fictionKey} chapterKey="Intro" />
        )}
      </Route>
      <Route path="/fiction/:fictionKey/chapter/:chapterKey">
        {({ fictionKey, chapterKey }) => (
          <Fiction
            node={node}
            fictionKey={fictionKey}
            chapterKey={chapterKey}
          />
        )}
      </Route>
    </Router>
  );
};
