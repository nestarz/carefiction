import {h, Fragment} from "preact";
import {Link} from "wouter-preact";
import {useGunState} from "./../../../src/utils/gun-hooks.js";
import {formatDate} from "./../../../src/utils/utils.js";
import {Text as Text2} from "./../../../src/components/Text.jsx";
import Image2 from "./../../../src/components/Image.jsx";
import Nav2 from "./../../../src/components/Nav.jsx";
export default ({node}) => {
  const [createdAt] = useGunState(node.get("createdAt"));
  return h("div", {
    className: "fiction"
  }, h("h1", null, h("span", null, "Care Fiction:"), h(Text2, {
    node: node.get("title"),
    placeholder: "Enter A Title"
  })), h(Nav2, {
    node
  }), h(Image2, {
    maxSizeKo: 300,
    node: node.get("image")
  }), h("h2", null, h(Text2, {
    node: node.get("subtitle"),
    placeholder: "Enter A Subtitle"
  })));
};
