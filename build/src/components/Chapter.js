import {h, Fragment} from "preact";
import {Link} from "wouter-preact";
import {useGunState} from "./../../../src/utils/gun-hooks.js";
import {formatDate} from "./../../../src/utils/utils.js";
import Paragraphs2 from "./../../../src/components/Paragraphs.jsx";
import {Text as Text2} from "./../../../src/components/Text.jsx";
import Image2 from "./../../../src/components/Image.jsx";
import Nav2 from "./../../../src/components/Nav.jsx";
export default ({fiction, chapter}) => {
  const [createdAt] = useGunState(chapter.get("createdAt"));
  return h("div", {
    className: "chapter"
  }, h("h1", null, h(Link, {
    to: `/fiction/${fiction._.get}`
  }, h("span", null, "Care Fiction:"), h(Text2, {
    node: fiction.get("title"),
    placeholder: "Enter A Title"
  }))), h(Nav2, {
    node: fiction,
    currentKey: chapter._.get
  }), h(Image2, {
    maxSizeKo: 400,
    node: chapter.get("image")
  }), h("h2", null, h(Text2, {
    node: chapter.get("subtitle"),
    placeholder: "Enter A Subtitle"
  })), h("time", {
    datetime: createdAt
  }, formatDate(createdAt)), h(Paragraphs2, {
    node: chapter
  }));
};
