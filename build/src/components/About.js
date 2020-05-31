import {h, Fragment} from "preact";
import Fictions2 from "./../../../src/components/Fictions.jsx";
export default ({node}) => {
  return h("div", {
    className: "about"
  }, h("h1", null, h("span", null, "CARE FICTION:"), h("span", null, "A PLAYGROUND FOR COMMONERS")), h("p", null, `Welcome! You're here because we would like you to join us in a game of collaborative fiction writing around and about a commoning project. "Commoning" is an ombrella term that brings together all the different ways people achieve to share the access and care of material and immaterial resources that in our society are more likely to be distributed top-down. Anything can be a common. A oven in a small village, an open source archive, a vegetables garden.`), h("p", null, `We started fiction 0, "The White House", and we'd like to to imagine with us how a scenario of commoning could look like. We put a few rudimental tools in place for you to co-write the story, to dream, envision, conceive, project. The more we all add, the more the story becomes richer, and selected. May the dream breach through the screen and become real.`), h("p", null, "We are three students from Design Academy Eindhoven who are interested in the topic of commoning. Feel free to get more involved, send us an email."), h(Fictions2, {
    node
  }));
};
