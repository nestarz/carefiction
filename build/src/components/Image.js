import {h, Fragment} from "preact";
import {useGunState} from "./../../../src/utils/gun-hooks.js";
import {classs, toBase64} from "./../../../src/utils/utils.js";
export default ({node, children, maxSizeKo = 0, className, onClick}) => {
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
  return h("div", {
    className: classs({
      lock,
      empty: !src
    }, "image", className)
  }, src ? h(Fragment, null, h("img", {
    onClick,
    src
  }), !lock && h(Fragment, null, h("button", {
    onClick: () => setSrc(null)
  }, "Remove"), h("button", {
    onClick: () => setLock(true)
  }, "Lock"))) : h("input", {
    onChange: add,
    type: "file",
    accept: "image/*"
  }), children);
};
