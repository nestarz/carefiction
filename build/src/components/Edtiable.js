import {h, Fragment} from "preact";
import {useState, useEffect, useRef} from "preact/hooks";
const setCaretNode = (node, index) => {
  if (node.lastChild)
    window.getSelection().collapse(node.lastChild, index > 0 ? index : node.lastChild.textContent.length + index + 1);
};
const eq = (a, b) => (a && a.toLowerCase()) === (b && b.toLowerCase());
export default ({current = "", placeholder, setCurrent, className, onValid = () => null}) => {
  const ref = useRef();
  const [focus, setFocus] = useState(false);
  useEffect(() => onValid(current && !eq(current, placeholder) && current !== ""), [current, placeholder]);
  useEffect(() => {
    ref.current.innerText = placeholder;
  }, [placeholder]);
  useEffect(() => {
    if (focus)
      setCaretNode(ref.current, -1);
    if (focus && eq(ref.current.innerText, placeholder))
      ref.current.innerText = "";
    else if (!focus && ref.current.innerText === "")
      ref.current.innerText = placeholder;
  }, [focus, placeholder]);
  useEffect(() => {
    if (!focus && current && !eq(current, placeholder))
      ref.current.innerText = current;
  }, [current, focus, placeholder]);
  return h("span", {
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
