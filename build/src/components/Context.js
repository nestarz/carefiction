import {h, Fragment} from "preact";
import {useState} from "preact/hooks";
import {Link} from "wouter-preact";
import {useGunSetState, useGunState} from "./../../../src/utils/gun-hooks.js";
import Video2 from "./../../../src/components/Video.jsx";
import Image2 from "./../../../src/components/Image.jsx";
import {Text as Text2, Sentence} from "./../../../src/components/Text.jsx";
const ContextParagraph = ({node, remove}) => {
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const [withImage, setWithImage] = useGunState(node.get("withImage"), false);
  const [withVideo, setWithVideo] = useGunState(node.get("withVideo"), false);
  const [valid, setValid] = useState(false);
  return h(Fragment, null, h("p", {
    className: "context"
  }, h(Sentence, {
    node,
    onValid: setValid,
    lock
  })), !lock && h(Fragment, null, h("button", {
    disabled: !valid,
    onClick: () => setLock(true)
  }, "Lock The Paragraph"), h("button", {
    onClick: remove
  }, "Remove The Paragraph"), !withVideo && h("button", {
    onClick: () => setWithImage(!withImage)
  }, withImage ? "Remove" : "Add", " Image"), !withImage && h("button", {
    onClick: () => setWithVideo(!withVideo)
  }, withVideo ? "Remove" : "Add", " Video")), withVideo && h(Video2, {
    node: node.get("video")
  }), withImage && h(Image2, {
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
  return h(Fragment, null, texts.map(({...props}) => h(ContextParagraph, {
    ...props
  })), h("button", {
    onClick: add
  }, "Add A New Paragraph"));
};
export default ({id, node}) => {
  return h(Fragment, null, h("h1", null, h("span", null, "Care Fiction:"), h(Text2, {
    node: node.get("title"),
    placeholder: "Enter A Title"
  })), h("ol", {
    start: "0"
  }, h("li", null, h(Link, {
    href: "/about/"
  }, "Intro")), h("li", null, h(Link, {
    href: `/fiction/${id}`
  }, "First visit")), h("li", {
    className: "active"
  }, h(Link, {
    href: `/context/${id}`
  }, "Context"))), h(Image2, {
    maxSizeKo: 300,
    node: node.get("image")
  }), h("h2", null, "CO-WRITE THE STORY!"), h(ContextParagraphs, {
    node
  }));
};
