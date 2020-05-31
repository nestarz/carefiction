import {h, Fragment} from "preact";
import {Link} from "wouter-preact";
import {useGunState} from "./../../../src/utils/gun-hooks.js";
import {formatDate, classs} from "./../../../src/utils/utils.js";
import Plan2 from "./../../../src/components/Plan.jsx";
import Paragraphs2 from "./../../../src/components/Paragraphs.jsx";
import {Text as Text2} from "./../../../src/components/Text.jsx";
import Image2 from "./../../../src/components/Image.jsx";
import Nav2 from "./../../../src/components/Nav.jsx";
export default ({fiction, chapter}) => {
  const [createdAt] = useGunState(chapter.get("createdAt"));
  const [type, setType] = useGunState(chapter.get("type").get("current"));
  const [typeLock, setTypeLock] = useGunState(chapter.get("type").get("lock"));
  return h("div", {
    className: classs("chapter", type)
  }, h("h1", null, h(Link, {
    to: `/fiction/${fiction._.get}`
  }, h("span", null, "Care Fiction:"), h(Text2, {
    node: fiction.get("title"),
    placeholder: "Enter A Title"
  }))), h(Nav2, {
    node: fiction,
    currentKey: chapter._.get
  }), type === "paragraphs" && typeLock ? h(Fragment, null, h(Image2, {
    maxSizeKo: 400,
    node: chapter.get("image")
  }), h("h2", null, h(Text2, {
    node: chapter.get("subtitle"),
    placeholder: "Enter A Subtitle"
  })), h("time", {
    datetime: createdAt
  }, formatDate(createdAt)), h(Paragraphs2, {
    node: chapter
  })) : type === "plan" && typeLock ? h(Plan2, {
    node: chapter.get("plan")
  }) : h("div", {
    className: "question"
  }, h("label", null, "This new chapter is"), h("input", {
    onClick: () => setType("plan"),
    type: "radio",
    checked: type == "plan",
    name: "type"
  }), h("label", {
    onClick: () => setType("plan")
  }, "a Plan"), h("input", {
    onClick: () => setType("paragraphs"),
    checked: type == "paragraphs",
    type: "radio",
    name: "type"
  }), h("label", {
    onClick: () => setType("paragraphs")
  }, "a Fill Gap"), h("button", {
    disabled: !type,
    onClick: () => setTypeLock(true)
  }, "Lock")));
};
