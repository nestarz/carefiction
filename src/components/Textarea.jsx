import { useGunState } from "../utils/gun-hooks.js";
import { classs } from "../utils/utils.js";
import { useRef, useEffect } from "preact/hooks";

export default ({ node, remove, placeholder }) => {
  const [value, setValue] = useGunState(node.get("current"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "1px";
      ref.current.style.height = 10 + ref.current.scrollHeight + "px";
    }
  }, [value, lock]);
  return (
    <>
      {!lock && (
        <div className="before-lock">
          <button onClick={remove}>✕</button>
          <button className={classs({ lock })} onClick={() => setLock(!lock)}>
            {lock ? "🔒" : "🔓"}
          </button>
        </div>
      )}
      {lock ? (
        <div className="textarea">{value}</div>
      ) : (
        <textarea
          ref={ref}
          readOnly={lock}
          placeholder={placeholder}
          defaultValue={value}
          onInput={(e) => {
            if (!lock) setValue(e.target.value);
          }}
          onKeyPress={(e) => {
            // !lock && setValue(e.target.value);
            if (e.which == 13 && !e.shiftKey) {
              e.preventDefault();
            }
          }}
        />
      )}
    </>
  );
};
