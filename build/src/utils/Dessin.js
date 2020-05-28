import React, {useState, useRef, useMemo} from "react";
import {useGunState, useGunSetState} from "./../../../src/App.jsx";
import {classs} from "./../../../src/utils/utils.js";
export default ({node}) => {
  const key = "dessins-4";
  const dessins = useGunSetState(node.get(key));
  console.log(dessins);
  const create = () => node.get(key).set({
    createdAt: new Date().toISOString()
  });
  return React.createElement(React.Fragment, null, dessins.map((id) => React.createElement(Dessin, {
    key: id,
    node: node.get(key).get(id)
  })), React.createElement(Locker, {
    node: node.get(key)
  }, (locked) => !locked && dessins.length < 1 && React.createElement("button", {
    onClick: create
  }, "Add a draw")));
};
const Locker = ({node, className, children}) => {
  const locked = useGunState(node.get("locked"));
  return React.createElement("div", {
    className: classs({
      locked
    }, className)
  }, !locked ? React.createElement(React.Fragment, null, children(locked), React.createElement("button", {
    onClick: () => node.get("locked").put(true)
  }, "Lock"), React.createElement("button", {
    onClick: () => node.back().unset(node)
  }, "Remove")) : children(locked));
};
const getPath = (points) => points.reduce((acc, [mode, x, y], i) => i === 0 ? `M${x},${y}` : `${acc}${mode || "L"}${x} ${y}`, "");
const normalize = (target, {clientX, clientY}) => {
  const {left, top, height, width} = target.getBoundingClientRect();
  return [(clientX - left) / width, (clientY - top) / height];
};
let time = 0;
const Dessin = ({node}) => {
  const svg = useRef();
  const path = useRef();
  const [record, setRecord] = useState(false);
  const [mode, setMode] = useState("M");
  const onClick = () => setRecord((prev) => !prev);
  const str = useGunState(node.get("points"), "[]");
  const points = useMemo(() => str ? JSON.parse(str).slice(0).slice(-200) : [], [str]);
  const d = useMemo(() => getPath(points), [points]);
  const onMove = (e) => {
    const delta = Date.now() - time;
    if (delta > 50) {
      if (record) {
        const [x, y] = normalize(svg.current, e).map((p) => Math.floor(p * 100));
        const newP = [...points, [mode, x, y]];
        node.get("points").put(JSON.stringify(newP));
        setMode("L");
        time = Date.now();
      } else
        setMode("M");
    }
  };
  return React.createElement(Locker, {
    className: "svg",
    node
  }, (locked) => locked ? React.createElement("svg", {
    viewBox: `0 0 100 100`,
    namespace: "http://www.w3.org/2000/svg"
  }, React.createElement("path", {
    "stroke-width": "0.15",
    d
  })) : React.createElement("svg", {
    ref: svg,
    viewBox: `0 0 100 100`,
    namespace: "http://www.w3.org/2000/svg",
    onClick,
    onMouseMove: onMove,
    onTouchStart: onClick,
    onTouchEnd: onClick,
    onTouchMove: (e) => onMove(e.touches[0])
  }, React.createElement("path", {
    "stroke-width": "0.15",
    ref: path,
    d
  })));
};
