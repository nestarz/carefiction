/* @jsx h */
import { h, Fragment } from "preact";

import InputText from "./InputText.jsx";
import Counter from "./Counter.jsx";
import { useGunState } from "../utils/gun-hooks.js";
import { classs } from "../utils/utils.js";

export default ({ node, remove }) => {
  const [lock, setLock] = useGunState(node.get("lock"), true);

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
      <InputText placeholder="Write something..." node={node} />
      <Counter node={node} />
    </>
  );
};
