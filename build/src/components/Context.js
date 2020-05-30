import React, {useState} from "react";
import {Link} from "wouter";
import {useGunSetState, useGunState} from "./../../../src/utils/gun-hooks.js";
import Video2 from "./../../../src/components/Video.jsx";
import Image2 from "./../../../src/components/Image.jsx";
import {Text as Text2, Sentence} from "./../../../src/components/Text.jsx";
const ContextParagraph = ({node, remove}) => {
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const [withImage, setWithImage] = useGunState(node.get("withImage"), false);
  const [withVideo, setWithVideo] = useGunState(node.get("withVideo"), false);
  const [valid, setValid] = useState(false);
  return React.createElement(React.Fragment, null, React.createElement("p", {
    className: "context"
  }, React.createElement(Sentence, {
    node,
    onValid: setValid,
    lock
  })), !lock && React.createElement(React.Fragment, null, React.createElement("button", {
    disabled: !valid,
    onClick: () => setLock(true)
  }, "Lock The Paragraph"), React.createElement("button", {
    onClick: remove
  }, "Remove The Paragraph"), !withVideo && React.createElement("button", {
    onClick: () => setWithImage(!withImage)
  }, withImage ? "Remove" : "Add", " Image"), !withImage && React.createElement("button", {
    onClick: () => setWithVideo(!withVideo)
  }, withVideo ? "Remove" : "Add", " Video")), withVideo && React.createElement(Video2, {
    node: node.get("video")
  }), withImage && React.createElement(Image2, {
    maxSizeKo: 500,
    node: node.get("image")
  }));
};
const ContextParagraphs = ({node}) => {
  const [texts, setTexts] = useGunSetState(node.get("texts"));
  const add = () => setTexts({
    createdAt: new Date().toISOString(),
    placeholder: "Write a text",
    lock: false
  });
  return React.createElement(React.Fragment, null, texts.map(({...props}) => React.createElement(ContextParagraph, {
    ...props
  })), React.createElement("button", {
    onClick: add
  }, "Add A New Paragraph"));
};
export default ({id, node}) => {
  return React.createElement(React.Fragment, null, React.createElement("h1", null, React.createElement("span", null, "Care Fiction:"), React.createElement(Text2, {
    node: node.get("title"),
    placeholder: "Enter A Title"
  })), React.createElement("ol", {
    start: "0"
  }, React.createElement("li", null, React.createElement(Link, {
    href: "/about/"
  }, "Intro")), React.createElement("li", null, React.createElement(Link, {
    href: `/fiction/${id}`
  }, "First visit")), React.createElement("li", {
    className: "active"
  }, React.createElement(Link, {
    href: `/context/${id}`
  }, "Context"))), React.createElement(Image2, {
    maxSizeKo: 300,
    node: node.get("image")
  }), React.createElement("h2", null, "CO-WRITE THE STORY!"), React.createElement(ContextParagraphs, {
    node
  }));
};
