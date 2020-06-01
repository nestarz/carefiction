import {h, Fragment} from "preact";
import {useState, useEffect, useMemo} from "preact/hooks";
import {useGunSetState, useGunState} from "./../../../src/utils/gun-hooks.js";
import {byCreateAt} from "./../../../src/utils/utils.js";
import {Sentence, Blank} from "./../../../src/components/Text.jsx";
import Dessins from "./../../../src/components/Dessin.jsx";
import Image2 from "./../../../src/components/Image.jsx";
const isType = (t) => ({data: {type}}) => type === t;
const Paragraph = ({node, remove}) => {
  const [gaps, setGaps] = useGunSetState(node.get("gaps"));
  const [values] = useGunSetState(node.get("gaps").map().get("values"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const [withImage, setWithImage] = useGunState(node.get("withImage"), false);
  const [valid, setValid] = useState(true);
  useEffect(() => setValid((prev) => gaps.length === 0 || prev), [gaps]);
  const blanks = useMemo(() => gaps.filter(isType("blank")).length, [gaps]);
  const texts = useMemo(() => gaps.filter(isType("text")).length, [gaps]);
  const add = (type, placeholder) => setGaps({
    createdAt: new Date().toISOString(),
    locked: false,
    type,
    placeholder
  });
  return h(Fragment, null, h(Dessins, {
    node,
    lock
  }), withImage && h(Image2, {
    maxSizeKo: 500,
    node: node.get("image")
  }), h("p", null, gaps.sort(byCreateAt).map(({data, ...props}) => data.type === "text" ? h(Sentence, {
    ...props,
    lock,
    onValid: setValid
  }) : h(Blank, {
    ...props,
    lock
  })), !lock && h(Fragment, null, h("button", {
    disabled: !(texts < 2),
    onClick: () => add("text", "Continue the story...")
  }, "Add A Text"), h("button", {
    disabled: !(blanks < 1),
    onClick: () => add("blank", "write something here...")
  }, "Add A Blank"))), values.sort(byCreateAt).map(({data: {value}}) => value && h("li", null, value)), !lock && h(Fragment, null, h("button", {
    onClick: () => setWithImage(!withImage)
  }, withImage ? "Remove" : "Add", " Image"), h("button", {
    disabled: !(valid && gaps.length !== 0),
    onClick: () => setLock(true)
  }, "Lock The Paragraph"), h("button", {
    onClick: remove
  }, "Remove The Paragraph")));
};
export default ({node}) => {
  const [paragraphs, setParagraphs] = useGunSetState(node.get("paragraphs"));
  useEffect(() => () => console.log(paragraphs, node._.get), [node]);
  const add = () => setParagraphs({
    createdAt: new Date().toISOString(),
    lock: false
  });
  return h(Fragment, null, paragraphs.sort(byCreateAt).map(({key, node: node2, remove}) => h(Paragraph, {
    key,
    node: node2,
    remove
  })), h("button", {
    onClick: add
  }, "Add A Paragraph"));
};
