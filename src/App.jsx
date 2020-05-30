/* @jsx h */
import { h, Fragment } from "preact";
import { Route, Router } from "wouter-preact";

import Page from "./components/Page.jsx";
import Pages from "./components/Pages.jsx";
import About from "./components/About.jsx";
import Context from "./components/Context.jsx";

export const session = new Date().toISOString();

export default () => {
  const node = window
    .Gun({
      peers: [
        "https://gun.eliasrhouzlane.com/gun",
        "https://carefiction-gun.herokuapp.com/gun",
      ],
    })
    .get("alpha-2");

  return (
    <Router basepath={location.pathname}>
      <Route path="/">{() => <Pages node={node.get("pages")} />}</Route>
      <Route path="/about" component={About}></Route>
      <Route path="/fiction/:key">
        {({ key }) => <Page id={key} node={node.get("pages").get(key)} />}
      </Route>
      <Route path="/context/:key">
        {({ key }) => (
          <Context id={key} node={node.get("pages").get(key).get("context")} />
        )}
      </Route>
    </Router>
  );
};
