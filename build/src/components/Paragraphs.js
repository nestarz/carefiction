import React, {useState, useEffect, useMemo} from "react";
import {useGunSetState, useGunState} from "./../../../src/utils/gun-hooks.js";
import {byCreateAt} from "./../../../src/utils/utils.js";
import {Sentence, Blank} from "./../../../src/components/Text.jsx";
import Dessins from "./../../../src/components/Dessin.jsx";
const isType = (t) => ({data: {type}}) => type === t;
const Paragraph = ({node, remove}) => {
  const [gaps, setGaps] = useGunSetState(node.get("gaps"));
  const [values] = useGunSetState(node.get("gaps").map().get("values"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
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
  return React.createElement(React.Fragment, null, React.createElement("p", null, gaps.sort(byCreateAt).map(({data, ...props}) => data.type === "text" ? React.createElement(Sentence, {
    ...props,
    lock,
    onValid: setValid
  }) : React.createElement(Blank, {
    ...props,
    lock
  })), !lock && React.createElement(React.Fragment, null, React.createElement("button", {
    disabled: !(texts < 2),
    onClick: () => add("text", "Continue the story...")
  }, "Add A Text"), React.createElement("button", {
    disabled: !(blanks < 1),
    onClick: () => add("blank", "write something here...")
  }, "Add A Blank"))), values.sort(byCreateAt).map(({data: {value}}) => value && React.createElement("li", null, value)), React.createElement(Dessins, {
    node,
    lock
  }), !lock && React.createElement(React.Fragment, null, React.createElement("button", {
    disabled: !(valid && gaps.length !== 0),
    onClick: () => setLock(true)
  }, "Lock The Paragraph"), React.createElement("button", {
    onClick: remove
  }, "Remove The Paragraph")));
};
export default ({node}) => {
  const [paragraphs, setParagraphs] = useGunSetState(node.get("paragraphs"));
  const add = () => setParagraphs({
    createdAt: new Date().toISOString(),
    lock: false
  });
  return React.createElement(React.Fragment, null, paragraphs.sort(byCreateAt).map(({key, node: node2, remove}) => React.createElement(Paragraph, {
    key,
    node: node2,
    remove
  })), React.createElement("button", {
    onClick: add
  }, "Add A Paragraph"));
};
