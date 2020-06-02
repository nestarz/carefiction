/* @jsx h */
import { h, Fragment } from "preact";
import { useGunState } from "../utils/gun-hooks.js";

import { session } from "../App.jsx";

export default ({ node, placeholder, onEnter = () => null }) => {
  const [value, setValue] = useGunState(
    node.get("values").get(session).get("current")
  );
  const [lock, setLock] = useGunState(
    node.get("values").get(session).get("lock")
  );
  const [count, setCount] = useGunState(
    node.get("values").get(session).get("count")
  );
  const [_, setCreatedAt] = useGunState(
    node.get("values").get(session).get("createdAt")
  );

  return (
    <>
      <input
        type="text"
        readOnly={lock}
        placeholder={placeholder}
        value={value}
        onKeyPress={(e) => {
          if (e.which == 13) {
            onEnter(e);
            setValue(e.target.value);
            setLock(true);
            setCount((count || 0) + 1);
            setCreatedAt(new Date().toISOString());
            e.preventDefault();
          }
        }}
      />
    </>
  );
};
