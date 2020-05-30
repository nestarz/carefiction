import React, { useRef } from "react";

import { useGunState } from "../utils/gun-hooks.js";

const getIframeSrc = (src) =>
  src
    .replace(
      /(?:http[s]?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g,
      "http://www.youtube-nocookie.com/embed/$1?&loop=1&autopause=0"
    )
    .replace(
      /(?:http[s]?:\/\/(?:www.)?vimeo\.com)\/(.+)/g,
      "//player.vimeo.com/video/$1?&loop=1&autopause=0"
    );

export default ({ node }) => {
  const [src, setSrc] = useGunState(node.get("src"));
  const [lock, setLock] = useGunState(node.get("lock"), true);

  const input = useRef();
  const submit = () => {
    const incSrc = input.current.value;
    if (getIframeSrc(incSrc) != incSrc) setSrc(incSrc);
    else alert("wrong video link (youtube/vimeo)");
  };

  return src ? (
    <div className="video">
      <iframe src={getIframeSrc(src)}></iframe>
      {!lock && (
        <>
          <button onClick={() => setSrc(null)}>Remove Link to Video</button>
          <button onClick={() => setLock(!lock)}>Lock</button>
        </>
      )}
    </div>
  ) : (
    <div className="video">
      <input
        ref={input}
        type="text"
        placeholder="Add Vimeo/Youtube Link"
      ></input>
      <button onClick={submit}>Submit</button>
    </div>
  );
};
