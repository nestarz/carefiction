import React, {useState, useEffect, useRef} from "react";
import {Link, Route, Router} from "wouter";
import Dessin2 from "./../../prev/utils/Dessin.jsx";
import {classs, setCaretNode, formatDate, toBase64} from "./../../prev/utils/utils.js";
const gun = window.Gun({
  peers: ["http://127.0.0.1:8765/gun"]
}).get(12);
const session = new Date().toISOString();
export const useGunState = (node, initialState = void 0) => {
  const [graph] = useState(node);
  const [value, setValue] = useState(initialState);
  useEffect(() => {
    const listener = graph.on((value2) => setValue(value2));
    return () => listener.off();
  }, [node]);
  return value;
};
export const useGunSetState = (node) => {
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
const Editable = ({current = "", placeholder, setCurrent}) => {
  const ref = useRef();
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    ref.current.innerText = placeholder;
  }, []);
  useEffect(() => {
    if (focus)
      setCaretNode(ref.current, -1);
    if (focus && ref.current.innerText === placeholder)
      ref.current.innerText = "";
    else if (!focus && ref.current.innerText === "")
      ref.current.innerText = placeholder;
  }, [focus]);
  useEffect(() => {
    if (!focus && current && current != placeholder)
      ref.current.innerText = current;
  }, [current, focus]);
  return React.createElement("span", {
    ref,
    contentEditable: true,
    onKeyUp: () => {
      if (!["", placeholder].includes(ref.current.innerText))
        setCurrent(ref.current.innerText);
      else
        setCurrent(null);
    },
    onBlur: () => setFocus(false),
    onFocus: () => setFocus(true)
  });
};
const Gap = ({node, onValid, onRemove, locked}) => {
  const type = useGunState(node.get("type"));
  const id = type === "blank" ? session : "text";
  const current = useGunState(node.get("current").get(id));
  const placeholder = useGunState(node.get("placeholder"), "");
  const setCurrent = (value) => {
    node.get("current").get(id).put(value);
    type === "blank" && node.get("values").get(session).put(value);
  };
  const editable = locked && type === "blank" || !locked && type === "text";
  useEffect(() => onValid(!editable || current), [current, editable]);
  return React.createElement(React.Fragment, null, React.createElement("span", {
    className: classs({
      editable
    }, type)
  }, editable ? React.createElement(Editable, {
    onValid,
    setCurrent,
    current,
    placeholder
  }) : React.createElement("span", null, current ?? placeholder), !locked && React.createElement("button", {
    onClick: () => onValid(true) || onRemove(node)
  }, "-")));
};
const GapValue = ({node}) => {
  const value = useGunState(node);
  return React.createElement("li", null, value);
};
const GapValues = ({node}) => {
  const values = useGunSetState(node.get("values"));
  return React.createElement(React.Fragment, null, values.map((id) => React.createElement(GapValue, {
    node: node.get("values").get(id)
  })));
};
const Paragraph = ({node}) => {
  const gaps = useGunSetState(node.get("gaps"));
  const locked = useGunState(node.get("locked"), true);
  const [valid, setValid] = useState(true);
  const lock = () => node.get("locked").put(true);
  const getGapFromId = (id) => node.get("gaps").get(id);
  const removeGap = (child) => node.get("gaps").unset(child);
  const createGap = () => node.get("gaps").set({
    type: gaps.length % 2 ? "blank" : "text",
    placeholder: gaps.length % 2 ? "write something here" : "Continue the story..."
  });
  return React.createElement(React.Fragment, null, React.createElement("p", null, gaps.map((id) => React.createElement(Gap, {
    key: id,
    locked,
    node: getGapFromId(id),
    onValid: setValid,
    onRemove: removeGap
  })), !locked && React.createElement("div", {
    className: "controls"
  }, React.createElement("button", {
    disabled: !(valid && gaps.length < 3),
    onClick: createGap
  }, "Add a Gap"), React.createElement("button", {
    disabled: !(valid && gaps.length > 1),
    onClick: lock
  }, "Lock"))), gaps.map((id) => React.createElement(GapValues, {
    node: getGapFromId(id),
    id
  })));
};
const Text = ({node, placeholder = "Write something here..."}) => {
  const title = useGunState(node.get("current"));
  const locked = useGunState(node.get("locked"));
  return !locked ? React.createElement("span", null, React.createElement(Editable, {
    current: title,
    placeholder,
    setCurrent: (value) => node.get("current").put(value)
  }), React.createElement("button", {
    onClick: () => node.get("locked").put(true)
  }, "Lock")) : React.createElement("span", null, title);
};
const Page = ({node}) => {
  const createdAt = useGunState(node.get("createdAt"));
  const image = useGunState(node.get("image").get("src"));
  const lockedImage = useGunState(node.get("image").get("locked"));
  const paragraphs = useGunSetState(node.get("paragraphs"));
  const create = () => node.get("paragraphs").set({
    createdAt: new Date().toISOString(),
    locked: false
  });
  const addImage = async (file) => {
    const maxSizeKo = 300;
    const sizeKo = parseInt(file.size / 1000);
    if (sizeKo > maxSizeKo)
      alert(`Image too big (${sizeKo} ko > ${maxSizeKo} ko)`);
    else
      node.get("image").put({
        src: await toBase64(file)
      });
  };
  return React.createElement(React.Fragment, null, React.createElement("h1", null, React.createElement("span", null, "Care Fiction:"), React.createElement(Text, {
    node: node.get("title"),
    placeholder: "Enter A Title"
  })), image ? React.createElement("div", {
    className: classs({
      locked: lockedImage
    }, "image")
  }, React.createElement("img", {
    src: image
  }), !lockedImage && React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: () => node.get("image").get("src").put(null)
  }, "Remove"), React.createElement("button", {
    onClick: () => node.get("image").get("locked").put(true)
  }, "Lock"))) : React.createElement("div", {
    className: "image"
  }, React.createElement("input", {
    onChange: (e) => addImage(e.target.files[0]),
    type: "file",
    accept: "image/*"
  })), React.createElement("h2", null, React.createElement(Text, {
    node: node.get("subtitle"),
    placeholder: "Enter A Subtitle"
  })), React.createElement("time", {
    datetime: createdAt
  }, formatDate(createdAt)), paragraphs.map((id) => React.createElement(Paragraph, {
    key: id,
    node: node.get("paragraphs").get(id)
  })), React.createElement("div", {
    className: "controls"
  }, React.createElement("button", {
    onClick: create
  }, "Add A Thought")));
};
const GunLink = ({id, node}) => {
  return React.createElement(Link, {
    href: `/fiction/${id}`
  }, React.createElement("a", null, id));
};
const Pages = () => {
  const pages = useGunSetState(gun.get("pages"));
  const create = () => gun.get("pages").set({
    createdAt: new Date().toISOString()
  });
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "controls"
  }, React.createElement("button", {
    onClick: create
  }, "Add A New Fiction")), pages.map((id) => React.createElement(GunLink, {
    key: id,
    id,
    node: gun.get("pages").get(id)
  })));
};
export default () => {
  return React.createElement(Router, {
    basepath: location.pathname
  }, React.createElement(Route, {
    path: "/",
    component: Pages
  }), React.createElement(Route, {
    path: "/about"
  }, "About Us"), React.createElement(Route, {
    path: "/fiction/:id"
  }, ({id}) => React.createElement(Page, {
    node: gun.get("pages").get(id)
  })));
};
