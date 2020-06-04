/* @jsx h */
import { h, Fragment } from "preact";

import { useGunState } from "../utils/gun-hooks.js";
import { toBase64, getSizeKo, compressImage } from "../utils/utils.js";

export default ({ node, remove, maxSizeKo = 400, onClick }) => {
  const [src, setSrc] = useGunState(node.get("src"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const add = async (event) => {
    const file = event.target.files[0];
    const base64 = await toBase64(file).then((base64) =>
      getSizeKo(base64) > maxSizeKo ? compressImage(base64, file.type) : base64
    );
    const sizeKo = getSizeKo(base64);
    if (sizeKo > maxSizeKo)
      alert(`Image too big (${sizeKo} ko > ${maxSizeKo} ko)`);
    else setSrc(base64);
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
