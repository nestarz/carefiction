import {h, Fragment} from "preact";
import {useRef} from "preact/hooks";
import {useGunState} from "./../../../src/utils/gun-hooks.js";
const getIframeSrc = (src) => src.replace(/(?:http[s]?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, "http://www.youtube-nocookie.com/embed/$1?&loop=1&autopause=0").replace(/(?:http[s]?:\/\/(?:www.)?vimeo\.com)\/(.+)/g, "//player.vimeo.com/video/$1?&loop=1&autopause=0");
export default ({node}) => {
  const [src, setSrc] = useGunState(node.get("src"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const input = useRef();
  const submit = () => {
    const incSrc = input.current.value;
    if (getIframeSrc(incSrc) != incSrc)
      setSrc(incSrc);
    else
      alert("wrong video link (youtube/vimeo)");
  };
  return src ? h("div", {
    className: "video"
  }, h("iframe", {
    src: getIframeSrc(src)
  }), !lock && h(Fragment, null, h("button", {
    onClick: () => setSrc(null)
  }, "Remove Link to Video"), h("button", {
    onClick: () => setLock(!lock)
  }, "Lock"))) : h("div", {
    className: "video"
  }, h("input", {
    ref: input,
    type: "text",
    placeholder: "Add Vimeo/Youtube Link"
  }), h("button", {
    onClick: submit
  }, "Submit"));
};
