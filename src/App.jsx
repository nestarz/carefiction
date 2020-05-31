/* @jsx h */
import { h, Fragment } from "preact";
import { Route, Router } from "wouter-preact";

import Chapter from "./components/Chapter.jsx";
import About from "./components/About.jsx";
import Fiction from "./components/Fiction.jsx";

export const session = new Date().toISOString();

export default () => {
  const node = window
    .Gun({
      peers: [
        "https://gun.eliasrhouzlane.com/gun",
        "https://carefiction-gun.herokuapp.com/gun",
      ],
    })
    .get("alpha-8");

  return (
    <Router basepath={location.pathname}>
      <Route path="/">{() => <About node={node} />}</Route>
      <Route path="/fiction/:key">
        {({ key }) => <Fiction node={node.get("pages").get(key)} />}
      </Route>
      <Route path="/fiction/:fiction/chapter/:chapter">
        {({ fiction, chapter }) => (
          <Chapter
            id={chapter}
            fiction={node.get("pages").get(fiction)}
            chapter={node
              .get("pages")
              .get(fiction)
              .get("chapters")
              .get(chapter)}
          />
        )}
      </Route>
    </Router>
  );
};
