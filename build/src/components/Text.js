import {h} from "preact";
import {useEffect} from "preact/hooks";
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
  return h("span", {
    className: "blank"
  }, lock ? h(Editable, {
    current,
    placeholder,
    setCurrent
  }) : h(Fragment, null, h(Editable, {
    current: placeholder,
    placeholder: "write something here",
    setCurrent: setPlaceholder
  }), h("button", {
    onClick: remove
  }, "Remove The Blank")));
};
export const Sentence = ({node, lock, remove, onValid}) => {
  const [placeholder] = useGunState(node.get("placeholder"));
  const [current, setCurrent] = useGunState(node.get("current"));
  const [bold, setBold] = useGunState(node.get("bold"));
  useEffect(() => onValid(current !== placeholder && current), [current]);
  return lock ? h("span", {
    className: classs({
      bold
    })
  }, current) : h(Fragment, null, h(Editable, {
    className: classs({
      bold
    }),
    current,
    placeholder,
    setCurrent
  }), h("button", {
    onClick: () => setBold(!bold)
  }, `${bold ? "Remove" : "Add"} Emphasis`), h("button", {
    onClick: remove
  }, "Remove The Text"));
};
export const Text = ({node, placeholder = "Write something here..."}) => {
  const [title, setTitle] = useGunState(node.get("current"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  return !lock ? h("span", null, h(Editable, {
    current: title,
    placeholder,
    setCurrent: setTitle
  }), h("button", {
    onClick: () => setLock(true)
  }, "Lock")) : h("span", null, title);
};
