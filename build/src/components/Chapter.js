import {h, Fragment} from "preact";
import {useGunSetState} from "./../../../src/utils/gun-hooks.js";
import {byCreateAt} from "./../../../src/utils/utils.js";
import Textarea2 from "./../../../src/components/Textarea.jsx";
import Blank2 from "./../../../src/components/Blank.jsx";
import Image2 from "./../../../src/components/Image.jsx";
import Drawing2 from "./../../../src/components/Drawing.jsx";
const components = {
  text: Textarea2,
  blank: Blank2,
  image: Image2,
  drawing: Drawing2
};
export const ChapterContent = ({node}) => {
  const [blocks] = useGunSetState(node.get("blocks"));
  return blocks.sort(byCreateAt).map(({node: node2, data, remove}) => h("article", {
    className: data.type
  }, h(components[data.type], {
    node: node2,
    remove
  })));
};
export const ChapterControls = ({node}) => {
  const [_, setBlocks] = useGunSetState(node.get("blocks"));
  const add = (type) => setBlocks({
    createdAt: new Date().toISOString(),
    type
  });
  return Object.keys(components).map((type) => h("button", {
    onClick: () => add(type)
  }, type));
};
