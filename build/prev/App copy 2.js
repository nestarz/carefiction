import React, {useState, useEffect} from "react";
import {classs, setText} from "./../../prev/utils/utils.js";
const gun = window.Gun();
const base = Math.random().toString();
const Editable = ({id: id2, className, init = "write something here"}) => {
  const [editable, set] = useGun({
    table: "editable"
  });
  return React.createElement("span", {
    id: id2,
    className: classs(className, "editable")
  }, React.createElement("span", {
    contenteditable: "true",
    onKeyUp: (e) => e.keyCode === 13 && set(e.target.textContent),
    onKeyDown: (e) => e.keyCode === 13 && e.preventDefault(),
    onFocus: ({target}) => setText(target, "", init),
    onBlur: ({target}) => setText(target, init, "")
  }, editable || init));
};
const Entries = ({id: id2}) => {
  const [entries] = useGun({
    table: "entries"
  });
  return entries.map((entry) => React.createElement("li", null, JSON.stringify(entry)));
};
const Gap = ({id: id2, editable = true}) => {
  const [gap, setGap] = useGun({
    table: "gap"
  });
  return React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement(Editable, {
    id: "non"
  }), gap.map(([id3]) => React.createElement(React.Fragment, null, React.createElement(Editable, {
    id: id3,
    className: "blank",
    id: "non"
  }), React.createElement(Editable, {
    id: id3
  }))), editable && React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: () => setGap({})
  }, "Add"))), React.createElement(Entries, {
    id: "test"
  }));
};
const useGunState = (root) => {
  const [graph] = useState(root);
  const [value, setValue] = useState(null);
  useEffect(() => graph.on((value2) => setValue(value2)).off, [root]);
  return [value, () => root.put];
};
const Gaps = () => {
  const [gun2] = useState(Gun({
    peers
  }));
  const [gaps, put] = useGunState(gun2.get("gaps"));
  return React.createElement(React.Fragment, null, gaps.map(([id2, gap]) => React.createElement(Gap, {
    onCreated: (node) => gun2.get("gaps").put(node),
    id: id2,
    ...gap
  })), React.createElement("button", {
    onClick: () => gun2.get("gap").get(id).put({
      name: "Bob"
    })
  }, "Add"));
};
export default () => React.createElement(React.Fragment, null, React.createElement("h1", null, React.createElement("span", null, "Care Fiction:"), React.createElement("span", null, "The White House")), React.createElement("img", {
  src: "assets/images/white_house.jpg"
}), React.createElement("h2", null, "Dreams of Commoning"), React.createElement("time", {
  datetime: "2021-05-23"
}, "23 May 2021"), React.createElement("p", null, "It's a Sunday, you're biking around Eindhoven. While turning around a corner you notice a big white house. It seems busy inside and a few people are chatting animatedly in the garden. ", React.createElement("br", null), " It seems like someone is"), React.createElement("li", null, "porch"), React.createElement("li", null, "table"), React.createElement("li", null, "a set of benches"), React.createElement("li", null, "a makeshift stage"), React.createElement("li", null, "a weird sculpture"), React.createElement(Gaps, null));
