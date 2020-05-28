export const insert = (text, letter, index) => `${text.slice(0, index)}${letter}${text.slice(index)}`;
export const remove = (text, index) => `${text.slice(0, index)}${text.slice(index + 1)}`;
const Editable = ({current, init, set, onValid}) => {
  const ref = useRef();
  const [caret, setCaret] = useState(0);
  useEffect(() => {
    ref.current.textContent = current ?? init;
    setCaretNode(ref.current, caret);
  }, [current, init]);
  useEffect(() => onValid(![init, ""].includes(current)), [init, current]);
  return React.createElement("span", {
    ref,
    contentEditable: true,
    onKeyPress: (e) => {
      if (e.key.length === 1) {
        const caret2 = window.getSelection().anchorOffset;
        set(insert(current, e.key, caret2));
        setCaret(caret2 + 1);
      }
      e.preventDefault();
    },
    onKeyDown: ({keyCode, target: {textContent: t}}) => {
      if (keyCode === 8) {
        const caret2 = window.getSelection().anchorOffset;
        set(remove(current, caret2));
        setCaret(caret2 - 1);
      } else if (t === init) {
        set("");
      }
    },
    onBlur: ({target: {textContent: t}}) => t === "" && set(init)
  });
};
