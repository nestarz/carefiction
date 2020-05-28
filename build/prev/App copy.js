import React, {useState, useEffect, useRef} from "react";
import {classs, insert} from "./../../prev/utils/utils.js";
const gun = window.Gun().get(Math.random());
const useGunState = (node, init = void 0) => {
  const [graph] = useState(node);
  const [value, setValue] = useState(init);
  useEffect(() => {
    const listener = graph.on((value2) => setValue(value2));
    return () => listener.off();
  }, [node]);
  return value;
};
const useGunSetState = (node) => {
  const [set, setSet] = useState([]);
  const add = (id) => (prev) => [...prev, id];
  const remove = (id) => (p) => p.filter((i) => i !== id.split("/").pop());
  const register = (_, id) => _ ? setSet(add(id)) : setSet(remove(id));
  useEffect(() => {
    const listener = node.map().once(register);
    return () => listener.off();
  }, [node]);
  return set;
};
const Editable = ({current, init, set, onValid}) => {
  const ref = useRef();
  useEffect(() => {
    ref.current.textContent = current ?? init;
  }, [current, init]);
  useEffect(() => onValid(![init, ""].includes(current)), [init, current]);
  const insert2 = (text, letter, index) => `${text.slice(0, index)}${letter}${text.slice(index)}`;
  return React.createElement("span", {
    ref,
    contentEditable: true,
    onKeyPress: (e) => {
      const select = window.getSelection();
      const caret = select.anchorOffset;
      const restore = () => select.collapse(ref.current.lastChild, caret + 1);
      if (e.key.length === 1)
        set(insert2(current, e.key, window.getSelection().anchorOffset));
      e.preventDefault();
    },
    onKeyDown: ({keyCode, target: {textContent: t}}) => keyCode === 8 ? set(current.slice(0, -1)) : t === init && set(""),
    onBlur: ({target: {textContent: t}}) => t === "" && set(init)
  });
};
const Gap = ({node, onValid, onRemove, locked}) => {
  const createdAt = useGunState(node.get("createdAt"));
  const type = useGunState(node.get("type"));
  const editable = useGunState(node.get("editable"), false);
  const current = useGunState(node.get("current"));
  const init = useGunState(node.get("init"), "");
  const set = (value) => Promise.resolve(node.get("current").put(value));
  useEffect(() => onValid(editable), []);
  return React.createElement(React.Fragment, null, React.createElement("span", {
    className: classs({
      editable
    }, type)
  }, editable ? React.createElement(Editable, {
    onValid,
    set,
    current,
    init
  }) : React.createElement("span", null, current ?? init)), locked && React.createElement("button", {
    onClick: () => onRemove(node)
  }, "Remove"));
};
const Paragraph = ({node}) => {
  const gaps = useGunSetState(node.get("gaps"));
  const locked = useGunState(node.get("locked"), true);
  const [valid, setValid] = useState(true);
  const create = () => valid && node.get("gaps").set({
    type: gaps.length % 2 ? "blank" : "text",
    init: gaps.length % 2 ? "write something here" : "Continue the story...",
    editable: locked ? gaps.length % 2 : (gaps.length + 1) % 2
  });
  const onRemove = (child) => node.get("gaps").unset(child);
  return React.createElement(React.Fragment, null, React.createElement("p", null, gaps.map((id) => React.createElement(Gap, {
    key: id,
    onValid: setValid,
    onRemove,
    locked,
    node: node.get("gaps").get(id)
  }))), React.createElement("button", {
    disabled: !valid,
    onClick: create
  }, "Create"));
};
const Page = ({node}) => {
  const title = useGunState(node.get("title"));
  const paragraphs = useGunSetState(node.get("paragraphs"));
  const create = () => node.get("paragraphs").set({
    createdAt: new Date().toISOString(),
    title: "Default",
    image: "default.png",
    locked: false
  });
  return React.createElement(React.Fragment, null, React.createElement("h1", null, React.createElement("span", null, "Care Fiction:"), React.createElement("span", null, title)), paragraphs.map((id) => React.createElement(Paragraph, {
    key: id,
    node: node.get("paragraphs").get(id)
  })), React.createElement("button", {
    onClick: create
  }, "Create"));
};
const Pages = () => {
  const pages = useGunSetState(gun.get("pages"));
  const create = () => gun.get("pages").set({
    createdAt: new Date().toISOString(),
    title: "Default",
    image: "default.png"
  });
  return React.createElement(React.Fragment, null, pages.map((id) => React.createElement(Page, {
    key: id,
    node: gun.get("pages").get(id)
  })), React.createElement("button", {
    onClick: create
  }, "Create"));
};
export default () => React.createElement(React.Fragment, null, React.createElement(Pages, null));
