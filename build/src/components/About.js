import {h, Fragment} from "preact";
import Fictions2 from "./../../../src/components/Fictions.jsx";
export default ({node}) => {
  return h("div", {
    className: "about"
  }, h("h1", null, h("span", null, "CARE FICTION:"), h("span", null, "A PLAYGROUND FOR COMMONERS")), h("h2", null, "Welcome!"), h("p", null, h("i", null, "Care Fiction"), " is the prototype of a playground for collaborative dreaming, envisioning, conceiving, projecting. It all starts with a targeted resource, or commons. We invite our guests to react to an existing value, by pouring their ideas, resources, scenarios, inside the container."), h("p", null, "Our generative fiction tool will combine all contributions and produce an ever changing story. The more we all add, the more the story becomes richer, and selected. May the dream breach through the screen and become real."), h(Fictions2, {
    node
  }));
};
