import {h, Fragment} from "preact";
import InputText2 from "./../../../src/components/InputText.jsx";
import Counter2 from "./../../../src/components/Counter.jsx";
import {useGunState} from "./../../../src/utils/gun-hooks.js";
import {classs} from "./../../../src/utils/utils.js";
export default ({node, remove}) => {
  const [lock, setLock] = useGunState(node.get("lock"), true);
  return h(Fragment, null, !lock && h("div", {
    className: "before-lock"
  }, h("button", {
    onClick: remove
  }, "✕"), h("button", {
    className: classs({
      lock
    }),
    onClick: () => setLock(!lock)
  }, lock ? "🔒" : "🔓")), h(InputText2, {
    placeholder: "Write something...",
    node
  }), h(Counter2, {
    node
  }));
};
