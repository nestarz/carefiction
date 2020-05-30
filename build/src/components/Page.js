import {h, Fragment} from "preact";
import {Link} from "wouter-preact";
import {useGunState} from "./../../../src/utils/gun-hooks.js";
import {formatDate} from "./../../../src/utils/utils.js";
import Paragraphs2 from "./../../../src/components/Paragraphs.jsx";
import {Text as Text2} from "./../../../src/components/Text.jsx";
import Image2 from "./../../../src/components/Image.jsx";
export default ({id, node}) => {
  const [createdAt] = useGunState(node.get("createdAt"));
  return h(Fragment, null, h("h1", null, h("span", null, "Care Fiction:"), h(Text2, {
    node: node.get("title"),
    placeholder: "Enter A Title"
  })), h("ol", {
    start: "0"
  }, h("li", null, h(Link, {
    href: "/about/"
  }, "Intro")), h("li", {
    className: "active"
  }, h("a", {
    href: "#"
  }, "First visit")), h("li", null, h(Link, {
    href: `/context/${id}`
  }, "Context"))), h(Image2, {
    maxSizeKo: 300,
    node: node.get("image")
  }), h("h2", null, h(Text2, {
    node: node.get("subtitle"),
    placeholder: "Enter A Subtitle"
  })), h("time", {
    datetime: createdAt
  }, formatDate(createdAt)), h(Paragraphs2, {
    node
  }));
};
