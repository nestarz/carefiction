import {h, Fragment} from "preact";
import {useGunState, useGunSetState} from "./../../../src/utils/gun-hooks.js";
import {session} from "./../../../src/App.jsx";
import {useState} from "preact/hooks";
import {classs} from "./../../../src/utils/utils.js";
const Button = ({node, lock, onClick}) => {
  const [count, setCount] = useGunState(node.get("count"));
  const [current] = useGunState(node.get("current"));
  const [clicked, setClicked] = useState(false);
  return h("button", {
    disabled: lock,
    className: classs({
      clicked
    }),
    onClick: (e) => {
      if (!lock) {
        setCount((count || 0) + 1);
        onClick(e);
        setClicked(true);
      }
    }
  }, h("span", null, current), h("span", {
    className: "count"
  }, count));
};
export default ({node}) => {
  const [values] = useGunSetState(node.get("values"));
  const [lock, setLock] = useGunState(node.get(session).get("lock"));
  return h(Fragment, null, values.map(({key, node: node2}) => h(Button, {
    key,
    node: node2,
    lock,
    onClick: () => setLock(true)
  })));
};
