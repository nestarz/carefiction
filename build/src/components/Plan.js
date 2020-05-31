import {h, Fragment} from "preact";
import {useEffect} from "preact/hooks";
import {useGunSetState, useGunState} from "./../../../src/utils/gun-hooks.js";
import {byCreateAt, classs} from "./../../../src/utils/utils.js";
import Editable from "./../../../src/components/Edtiable.jsx";
import Image2 from "./../../../src/components/Image.jsx";
import {session} from "./../../../src/App.jsx";
export const Blank = ({node, remove}) => {
  const [lock, setLock] = useGunState(node.get("lock"));
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
  }, "Remove The Blank"), h("button", {
    onClick: () => setLock(true)
  }, "Lock The Blank")));
};
const normalize = (target, {clientX, clientY}) => {
  const {left, top, height, width} = target.getBoundingClientRect();
  return [(clientX - left) / width, (clientY - top) / height];
};
const Landmark = ({data, remove, key, node, index}) => {
  const [values] = useGunSetState(node.get("values"));
  return h("span", {
    style: {
      left: `${data.x * 100}%`,
      top: `${data.y * 100}%`
    }
  }, h("span", null, index + 1), h(Blank, {
    key,
    node,
    remove
  }), h("ul", {
    className: "answers"
  }, values.sort((a, b) => !byCreateAt(a, b)).map(({key: key2, data: {value}}) => value && h("li", {
    key: key2
  }, value))));
};
const Plan = ({node, remove}) => {
  const [lock, setLock] = useGunState(node.get("plans"));
  const [landmarks, setLandmarks] = useGunSetState(node.get("landmarks"));
  const setLandmark = (e) => {
    if (lock)
      return;
    const [x, y] = normalize(e.target, e);
    console.log(x, y);
    setLandmarks({
      createdAt: new Date().toISOString(),
      x,
      y
    });
  };
  return h(Fragment, null, h(Image2, {
    className: classs("landmark-container", {
      lock
    }),
    maxSizeKo: 300,
    node: node.get("image"),
    onClick: setLandmark
  }, landmarks.map(({key, data, remove: remove2, node: node2}, index) => h(Landmark, {
    data,
    key,
    remove: remove2,
    node: node2,
    index
  }))), !lock && h(Fragment, null, h("button", {
    onClick: () => setLock(true)
  }, "Lock The Plan"), h("button", {
    onClick: remove
  }, "Remove The Plan")));
};
export default ({node}) => {
  const [plans, setPlans] = useGunSetState(node.get("plans"));
  const add = () => setPlans({
    createdAt: new Date().toISOString(),
    lock: false
  });
  return h(Fragment, null, plans.sort(byCreateAt).map(({key, node: node2, remove}) => h(Plan, {
    key,
    node: node2,
    remove
  })), h("button", {
    onClick: add
  }, "Add a plan"));
};
