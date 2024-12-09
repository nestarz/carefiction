import { render } from "preact";
import { Route, Router, Switch } from "wouter-preact";
import { useGun } from "./src/utils/gun-hooks.js";

export const session = new Date().toISOString();

import Fiction from "./src/components/Fiction.jsx";
import RenderGunDocument from "./src/components/RenderGunDocument.jsx";

const App = () => {
  const node = useGun({
    peers: ["/gun"],
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
        <Route path="/p2p/data/">
          {() => <RenderGunDocument node={node} />}
        </Route>
        <Route path="/:rest*">{() => <Fiction node={node} />}</Route>
        <Route path="/*">{() => <Fiction node={node} />}</Route>
      </Switch>
    </Router>
  );
};

const root = document.body.insertBefore(
  document.createElement("div"),
  document.body.firstChild,
);

render(<App />, root);

console.log(root);

export default App;
