import React from "react";
import {useGunState} from "./../../../src/utils/gun-hooks.js";
import {classs} from "./../../../src/utils/utils.js";
export default ({node, maxSizeKo = 0}) => {
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
  return React.createElement("div", {
    className: classs({
      lock,
      empty: !src
    }, "image")
  }, src ? React.createElement(React.Fragment, null, React.createElement("img", {
    src
  }), !lock && React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: () => setSrc(null)
  }, "Remove"), React.createElement("button", {
    onClick: () => setLock(true)
  }, "Lock"))) : React.createElement("input", {
    onChange: add,
    type: "file",
    accept: "image/*"
  }));
};
