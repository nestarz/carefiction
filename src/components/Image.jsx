/* @jsx h */
import { h, Fragment } from "preact";

import { useGunState } from "../utils/gun-hooks.js";
import { classs, toBase64 } from "../utils/utils.js";

export default ({ node, children, maxSizeKo = 0, className, onClick }) => {
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
    <div className={classs({ lock, empty: !src }, "image", className)}>
      {src ? (
        <>
          <img onClick={onClick} src={src} />
          {!lock && (
            <>
              <button onClick={() => setSrc(null)}>Remove</button>
              <button onClick={() => setLock(true)}>Lock</button>
            </>
          )}
        </>
      ) : (
        <input onChange={add} type="file" accept="image/*"></input>
      )}
      {children}
    </div>
  );
};
