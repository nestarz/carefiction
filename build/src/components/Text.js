import React, {useEffect} from "react";
import {useGunState} from "./../../../src/utils/gun-hooks.js";
import {classs} from "./../../../src/utils/utils.js";
import Editable from "./../../../src/components/Edtiable.jsx";
import {session} from "./../../../src/App.jsx";
export const Blank = ({node, lock, remove}) => {
  const [placeholder, setPlaceholder] = useGunState(node.get("placeholder"));
  const [current, setCurrent] = useGunState(node.get(session).get("current"));
  const [_, setValue] = useGunState(node.get("values").get(session));
  useEffect(() => {
    if (current)
      setValue({
        createdAt: new Date().toISOString(),
        value: current
      });
  }, [current]);
  return React.createElement("span", {
    className: "blank"
  }, lock ? React.createElement(Editable, {
    current,
    placeholder,
    setCurrent
  }) : React.createElement(React.Fragment, null, React.createElement(Editable, {
    current: placeholder,
    placeholder: "write something here",
    setCurrent: setPlaceholder
  }), React.createElement("button", {
    onClick: remove
  }, "Remove The Blank")));
};
export const Sentence = ({node, lock, remove, onValid}) => {
  const [placeholder] = useGunState(node.get("placeholder"));
  const [current, setCurrent] = useGunState(node.get("current"));
  const [bold, setBold] = useGunState(node.get("bold"));
  useEffect(() => onValid(current !== placeholder && current), [current]);
  return lock ? React.createElement("span", {
    className: classs({
      bold
    })
  }, current) : React.createElement(React.Fragment, null, React.createElement(Editable, {
    className: classs({
      bold
    }),
    current,
    placeholder,
    setCurrent
  }), React.createElement("button", {
    onClick: () => setBold(!bold)
  }, `${bold ? "Remove" : "Add"} Emphasis`), React.createElement("button", {
    onClick: remove
  }, "Remove The Text"));
};
export const Text = ({node, placeholder = "Write something here..."}) => {
  const [title, setTitle] = useGunState(node.get("current"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  return !lock ? React.createElement("span", null, React.createElement(Editable, {
    current: title,
    placeholder,
    setCurrent: setTitle
  }), React.createElement("button", {
    onClick: () => setLock(true)
  }, "Lock")) : React.createElement("span", null, title);
};
