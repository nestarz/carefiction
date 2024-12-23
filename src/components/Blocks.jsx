import { h } from "preact";
import { useGunSetState } from "../utils/gun-hooks.js";
import { byCreateAt } from "../utils/utils.js";

import Textarea from "./Textarea.jsx";
import Blank from "./Blank.jsx";
import Image from "./Image.jsx";
import Drawing from "./Drawing.jsx";

const components = {
  text: Textarea,
  blank: Blank,
  image: Image,
  drawing: Drawing,
};

export const BlocksContent = ({ node }) => {
  const [blocks] = useGunSetState(node.get("blocks"));
  return blocks
    .sort(byCreateAt)
    .reverse()
    .map(({ key, node, data, remove }) => (
      <article key={key} className={data.type}>
        {/* <span className="hidden" onClick={remove}>Remove</span> */}
        {h(components[data.type], { node, remove })}
      </article>
    ));
};

export const BlocksProducer = ({ node, onUpdate = () => null }) => {
  const [_, setBlocks] = useGunSetState(node.get("blocks"));
  const add = (type) => {
    setBlocks({
      createdAt: new Date().toISOString(),
      type,
    });
    onUpdate(type);
  };
  return Object.keys(components).map((type) => (
    <button key={type} onClick={() => add(type)}>
      {type}
    </button>
  ));
};
