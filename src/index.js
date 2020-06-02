import { h, render } from "preact";

import App from "./App.jsx";

render(
  h(App),
  document.body.insertBefore(
    document.createElement("div"),
    document.body.firstChild
  )
);
