import React, {useState, useEffect, useRef} from "react";
const setCaretNode = (node, index) => {
  if (node.lastChild)
    window.getSelection().collapse(node.lastChild, index > 0 ? index : node.lastChild.textContent.length + index + 1);
};
export default ({current = "", placeholder, setCurrent, className}) => {
  const ref = useRef();
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    ref.current.innerText = placeholder;
  }, [placeholder]);
  useEffect(() => {
    if (focus)
      setCaretNode(ref.current, -1);
    if (focus && ref.current.innerText === placeholder)
      ref.current.innerText = "";
    else if (!focus && ref.current.innerText === "")
      ref.current.innerText = placeholder;
  }, [focus, placeholder]);
  useEffect(() => {
    if (!focus && current && current != placeholder)
      ref.current.innerText = current;
  }, [current, focus, placeholder]);
  return React.createElement("span", {
    className,
    ref,
    contentEditable: true,
    onKeyUp: () => {
      if (!["", placeholder].includes(ref.current.innerText))
        setCurrent(ref.current.innerText);
      else
        setCurrent(null);
    },
    onBlur: () => setFocus(false),
    onFocus: () => setFocus(true)
  });
};
