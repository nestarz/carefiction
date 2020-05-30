import React from "react";
import {Link} from "wouter";
import {useGunState} from "./../../../src/utils/gun-hooks.js";
import {formatDate} from "./../../../src/utils/utils.js";
import Paragraphs2 from "./../../../src/components/Paragraphs.jsx";
import {Text as Text2} from "./../../../src/components/Text.jsx";
import Image2 from "./../../../src/components/Image.jsx";
export default ({id, node}) => {
  const [createdAt] = useGunState(node.get("createdAt"));
  return React.createElement(React.Fragment, null, React.createElement("h1", null, React.createElement("span", null, "Care Fiction:"), React.createElement(Text2, {
    node: node.get("title"),
    placeholder: "Enter A Title"
  })), React.createElement("ol", {
    start: "0"
  }, React.createElement("li", null, React.createElement(Link, {
    href: "/about/"
  }, "Intro")), React.createElement("li", {
    className: "active"
  }, React.createElement("a", {
    href: "#"
  }, "First visit")), React.createElement("li", null, React.createElement(Link, {
    href: `/context/${id}`
  }, "Context"))), React.createElement(Image2, {
    maxSizeKo: 300,
    node: node.get("image")
  }), React.createElement("h2", null, React.createElement(Text2, {
    node: node.get("subtitle"),
    placeholder: "Enter A Subtitle"
  })), React.createElement("time", {
    datetime: createdAt
  }, formatDate(createdAt)), React.createElement(Paragraphs2, {
    node
  }));
};
