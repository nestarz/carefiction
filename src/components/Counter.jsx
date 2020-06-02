/* @jsx h */
import { h, Fragment } from "preact";
import { useGunState, useGunSetState } from "../utils/gun-hooks.js";

import { session } from "../App.jsx";
import { useState } from "preact/hooks";
import { classs } from "../utils/utils.js";

const Button = ({ node, lock, onClick }) => {
  const [count, setCount] = useGunState(node.get("count"));
  const [current] = useGunState(node.get("current"));
  const [clicked, setClicked] = useState(false);

  return (
    <button
      disabled={lock}
      className={classs({ clicked })}
      onClick={(e) => {
        if (!lock) {
          setCount((count || 0) + 1);
          onClick(e);
          setClicked(true);
        }
      }}
    >
      <span>{current}</span>
      <span className="count">{count}</span>
    </button>
  );
};

export default ({ node }) => {
  const [values] = useGunSetState(node.get("values"));
  const [lock, setLock] = useGunState(node.get(session).get("lock"));

  return (
    <>
      {values.map(({ key, node }) => (
        <Button
          key={key}
          node={node}
          lock={lock}
          onClick={() => setLock(true)}
        />
      ))}
    </>
  );
};
