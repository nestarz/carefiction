import {h, Fragment} from "preact";
import {useGunState} from "./../../../src/utils/gun-hooks.js";
import {toBase64} from "./../../../src/utils/utils.js";
export default ({node, remove, maxSizeKo = 400, onClick}) => {
  const [src, setSrc] = useGunState(node.get("src"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const add = async (event) => {
    const file = event.target.files[0];
    const sizeKo = parseInt(file.size / 1000);
    if (sizeKo > maxSizeKo)
      alert(`Image too big (${sizeKo} ko > ${maxSizeKo} ko)`);
    else
      setSrc(await toBase64(file));
  };
  return h(Fragment, null, !lock && h("div", {
    className: "before-lock"
  }, h("button", {
    onClick: remove
  }, "╳"), src && h("button", {
    onClick: () => setLock(true)
  }, lock ? "🔒" : "🔓")), src ? h("img", {
    onClick,
    src
  }) : h("input", {
    onChange: add,
    type: "file",
    accept: "image/*"
  }));
};
