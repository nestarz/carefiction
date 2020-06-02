/* @jsx h */
import { h, Fragment } from "preact";

import { useGunState } from "../utils/gun-hooks.js";
import { toBase64 } from "../utils/utils.js";

export default ({ node, remove, maxSizeKo = 400, onClick }) => {
  const [src, setSrc] = useGunState(node.get("src"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const add = async (event) => {
    const file = event.target.files[0];
    const sizeKo = parseInt(file.size / 1000);
    if (sizeKo > maxSizeKo)
      alert(`Image too big (${sizeKo} ko > ${maxSizeKo} ko)`);
    else setSrc(await toBase64(file));
  };

  return (
    <>
      {!lock && (
        <div className="before-lock">
          <button onClick={remove}>✕</button>
          {src && (
            <button onClick={() => setLock(true)}>{lock ? "🔒" : "🔓"}</button>
          )}
        </div>
      )}
      {src ? (
        <img onClick={onClick} src={src} />
      ) : (
        <input onChange={add} type="file" accept="image/*"></input>
      )}
    </>
  );
};
