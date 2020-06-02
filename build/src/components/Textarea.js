import {h, Fragment} from "preact";
import {useGunState} from "./../../../src/utils/gun-hooks.js";
import {classs} from "./../../../src/utils/utils.js";
import {useRef, useEffect} from "preact/hooks";
export default ({node, placeholder}) => {
  const [value, setValue] = useGunState(node.get("current"));
  const [lock, setLock] = useGunState(node.get("lock"));
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "1px";
      ref.current.style.height = 10 + ref.current.scrollHeight + "px";
    }
  }, [value, lock]);
  return h(Fragment, null, h("div", {
    className: "before-lock"
  }, h("button", {
    className: classs({
      lock
    }),
    onClick: () => setLock(!lock)
  }, lock ? "🔒" : "🔓")), lock ? h("div", {
    className: "textarea"
  }, value) : h("textarea", {
    ref,
    readOnly: lock,
    placeholder,
    value,
    onChange: (e) => {
      if (!lock)
        setValue(e.target.value);
    },
    onKeyPress: (e) => {
      !lock && setValue(e.target.value);
      if (e.which == 13 && !e.shiftKey) {
        e.preventDefault();
      }
    }
  }));
};
