import React, {useState, useEffect, useMemo, useRef} from "react";
import {Link, Route, Router} from "wouter";
import Editable from "./../../src/utils/Edtiable.jsx";
import Dessin2 from "./../../src/utils/Dessin.jsx";
import {useGunSetState, useGunState} from "./../../src/utils/gun-hooks.js";
import {classs, formatDate, toBase64} from "./../../src/utils/utils.js";
const session = new Date().toISOString();
const gun = window.Gun({
  peers: ["https://gun.eliasrhouzlane.com/gun"]
}).get("alpha-2");
const Blank = ({node, lock, remove}) => {
  const [placeholder, setPlaceholder] = useGunState(node.get("placeholder"));
  const [current, setCurrent] = useGunState(node.get(session).get("current"));
  const [_, setValue] = useGunState(node.get("values").get(session));
  useEffect(() => {
    if (current)
      setValue({
        createdAt: new Date().toISOString(),
        value: current
      });
  }, [current]);
  return React.createElement("span", {
    className: "blank"
  }, lock ? React.createElement(Editable, {
    current,
    placeholder,
    setCurrent
  }) : React.createElement(React.Fragment, null, React.createElement(Editable, {
    current: placeholder,
    placeholder: "write something here",
    setCurrent: setPlaceholder
  }), React.createElement("button", {
    onClick: remove
  }, "Remove The Blank")));
};
const Sentence = ({node, lock, remove, onValid}) => {
  const [placeholder] = useGunState(node.get("placeholder"));
  const [current, setCurrent] = useGunState(node.get("current"));
  const [bold, setBold] = useGunState(node.get("bold"));
  useEffect(() => onValid(current !== placeholder && current), [current]);
  return lock ? React.createElement("span", {
    className: classs({
      bold
    })
  }, current) : React.createElement(React.Fragment, null, React.createElement(Editable, {
    className: classs({
      bold
    }),
    current,
    placeholder,
    setCurrent
  }), React.createElement("button", {
    onClick: () => setBold(!bold)
  }, `${bold ? "Remove" : "Add"} Emphasis`), React.createElement("button", {
    onClick: remove
  }, "Remove The Text"));
};
const isType = (t) => ({data: {type}}) => type === t;
const byCreateAt = ({data: {createdAt: a}}, {data: {createdAt: b}}) => +Date.parse(a) > +Date.parse(b);
const Paragraph = ({node, remove}) => {
  const [gaps, setGaps] = useGunSetState(node.get("gaps"));
  const [values] = useGunSetState(node.get("gaps").map().get("values"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const [valid, setValid] = useState(true);
  useEffect(() => setValid((prev) => gaps.length === 0 || prev), [gaps]);
  const blanks = useMemo(() => gaps.filter(isType("blank")).length);
  const texts = useMemo(() => gaps.filter(isType("text")).length);
  const add = (type, placeholder) => setGaps({
    createdAt: new Date().toISOString(),
    locked: false,
    type,
    placeholder
  });
  const addText = () => add("text", "Continue the story...");
  const addBlank = () => add("blank", "write something here...");
  return React.createElement(React.Fragment, null, React.createElement("p", null, gaps.sort(byCreateAt).map(({data, ...props}) => data.type === "text" ? React.createElement(Sentence, {
    ...props,
    lock,
    onValid: setValid
  }) : React.createElement(Blank, {
    ...props,
    lock
  })), !lock && React.createElement(React.Fragment, null, React.createElement("button", {
    disabled: !(texts < 2),
    onClick: addText
  }, "Add A Text"), React.createElement("button", {
    disabled: !(blanks < 1),
    onClick: addBlank
  }, "Add A Blank"))), values.sort(byCreateAt).map(({data: {value}}) => value && React.createElement("li", null, value)), React.createElement(Dessins, {
    node,
    lock
  }), !lock && React.createElement(React.Fragment, null, React.createElement("button", {
    disabled: !(valid && gaps.length !== 0),
    onClick: () => setLock(true)
  }, "Lock The Paragraph"), React.createElement("button", {
    onClick: remove
  }, "Remove The Paragraph")));
};
const Dessins = ({node, lock}) => {
  const [dessins, setDessins] = useGunSetState(node.get("dessins2"));
  const add = () => setDessins({
    createdAt: new Date().toISOString()
  });
  return React.createElement(React.Fragment, null, dessins.sort(byCreateAt).map(({key, node: node2, remove}) => React.createElement(Dessin2, {
    key,
    node: node2,
    remove
  })), !lock && dessins.length === 0 && React.createElement("button", {
    onClick: add
  }, "Add A Drawing"));
};
const Paragraphs = ({node}) => {
  const [paragraphs, setParagraphs] = useGunSetState(node.get("paragraphs4"));
  const add = () => setParagraphs({
    createdAt: new Date().toISOString(),
    lock: false
  });
  return React.createElement(React.Fragment, null, paragraphs.sort(byCreateAt).map(({key, node: node2, remove}) => React.createElement(Paragraph, {
    key,
    node: node2,
    remove
  })), React.createElement("button", {
    onClick: add
  }, "Add A Paragraph"));
};
const Text = ({node, placeholder = "Write something here..."}) => {
  const [title, setTitle] = useGunState(node.get("current"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  return !lock ? React.createElement("span", null, React.createElement(Editable, {
    current: title,
    placeholder,
    setCurrent: setTitle
  }), React.createElement("button", {
    onClick: () => setLock(true)
  }, "Lock")) : React.createElement("span", null, title);
};
const Image = ({node, maxSizeKo = 0}) => {
  const [src, setSrc] = useGunState(node.get("src"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const add = async (event) => {
    const file = event.target.files[0];
    const sizeKo = parseInt(file.size / 1000);
    if (sizeKo > maxSizeKo)
      alert(`Image too big (${sizeKo} ko > ${maxSizeKo} ko)`);
    else
      setSrc(await toBase64(file));
  };
  return React.createElement("div", {
    className: classs({
      lock,
      empty: !src
    }, "image")
  }, src ? React.createElement(React.Fragment, null, React.createElement("img", {
    src
  }), !lock && React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: () => setSrc(null)
  }, "Remove"), React.createElement("button", {
    onClick: () => setLock(true)
  }, "Lock"))) : React.createElement("input", {
    onChange: add,
    type: "file",
    accept: "image/*"
  }));
};
const Page = ({id, node}) => {
  const [createdAt] = useGunState(node.get("createdAt"));
  return React.createElement(React.Fragment, null, React.createElement("h1", null, React.createElement("span", null, "Care Fiction:"), React.createElement(Text, {
    node: node.get("title"),
    placeholder: "Enter A Title"
  })), React.createElement("ol", {
    start: "0"
  }, React.createElement("li", null, React.createElement(Link, {
    href: "/about/"
  }, "Intro")), React.createElement("li", {
    className: "active"
  }, React.createElement("a", {
    href: "#"
  }, "First visit")), React.createElement("li", null, React.createElement(Link, {
    href: `/context/${id}`
  }, "Context"))), React.createElement(Image, {
    maxSizeKo: 300,
    node: node.get("image")
  }), React.createElement("h2", null), React.createElement("time", {
    datetime: createdAt
  }, formatDate(createdAt)), React.createElement(Paragraphs, {
    node
  }));
};
const Pages = () => {
  const [pages, setPages] = useGunSetState(gun.get("pages"));
  const add = () => setPages({
    createdAt: new Date().toISOString(),
    lock: false
  });
  return React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: add
  }, "Add A New Fiction"), pages.sort(byCreateAt).map(({key}) => React.createElement(Link, {
    href: `/fiction/${key}`
  }, React.createElement("a", null, key))));
};
const About = () => {
  return React.createElement(React.Fragment, null, React.createElement("h1", null, React.createElement("span", null, "CARE FICTION:"), React.createElement("span", null, "A PLAYGROUND FOR COMMONERS")), React.createElement("h2", null, "Welcome!"), React.createElement("p", null, React.createElement("i", null, "Care Fiction"), " is the prototype of a playground for collaborative dreaming, envisioning, conceiving, projecting. It all starts with a targeted resource, or commons. We invite our guests to react to an existing value, by pouring their ideas, resources, scenarios, inside the container."), React.createElement("p", null, "Our generative fiction tool will combine all contributions and produce an ever changing story. The more we all add, the more the story becomes richer, and selected. May the dream breach through the screen and become real."));
};
const getIframeSrc = (src) => src.replace(/(?:http[s]?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, "http://www.youtube-nocookie.com/embed/$1?&loop=1&autopause=0").replace(/(?:http[s]?:\/\/(?:www.)?vimeo\.com)\/(.+)/g, "//player.vimeo.com/video/$1?&loop=1&autopause=0");
const Video = ({node}) => {
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
  return src ? React.createElement("div", {
    className: "video"
  }, React.createElement("iframe", {
    src: getIframeSrc(src)
  }), !lock && React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: () => setSrc(null)
  }, "Remove Link to Video"), React.createElement("button", {
    onClick: () => setLock(!lock)
  }, "Lock"))) : React.createElement("div", {
    className: "video"
  }, React.createElement("input", {
    ref: input,
    type: "text",
    placeholder: "Add Vimeo/Youtube Link"
  }), React.createElement("button", {
    onClick: submit
  }, "Submit"));
};
const ContextParagraph = ({node, remove}) => {
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const [withImage, setWithImage] = useGunState(node.get("withImage"), false);
  const [withVideo, setWithVideo] = useGunState(node.get("withVideo"), false);
  const [valid, setValid] = useState(false);
  return React.createElement(React.Fragment, null, React.createElement("p", {
    className: "context"
  }, React.createElement(Sentence, {
    node,
    onValid: setValid,
    lock
  })), !lock && React.createElement(React.Fragment, null, React.createElement("button", {
    disabled: !valid,
    onClick: () => setLock(true)
  }, "Lock The Paragraph"), React.createElement("button", {
    onClick: remove
  }, "Remove The Paragraph"), !withVideo && React.createElement("button", {
    onClick: () => setWithImage(!withImage)
  }, withImage ? "Remove" : "Add", " Image"), !withImage && React.createElement("button", {
    onClick: () => setWithVideo(!withVideo)
  }, withVideo ? "Remove" : "Add", " Video")), withVideo && React.createElement(Video, {
    node: node.get("video")
  }), withImage && React.createElement(Image, {
    maxSizeKo: 500,
    node: node.get("image")
  }));
};
const ContextParagraphs = ({node}) => {
  const [texts, setTexts] = useGunSetState(node.get("context").get("texts"));
  const add = () => setTexts({
    createdAt: new Date().toISOString(),
    placeholder: "Write a text",
    lock: false
  });
  return React.createElement(React.Fragment, null, texts.map(({...props}) => React.createElement(ContextParagraph, {
    ...props
  })), React.createElement("button", {
    onClick: add
  }, "Add A New Paragraph"));
};
const Context = ({id, node}) => {
  return React.createElement(React.Fragment, null, React.createElement("h1", null, React.createElement("span", null, "Care Fiction:"), React.createElement(Text, {
    node: node.get("title"),
    placeholder: "Enter A Title"
  })), React.createElement("ol", {
    start: "0"
  }, React.createElement("li", null, React.createElement(Link, {
    href: "/about/"
  }, "Intro")), React.createElement("li", null, React.createElement(Link, {
    href: `/fiction/${id}`
  }, "First visit")), React.createElement("li", {
    className: "active"
  }, React.createElement(Link, {
    href: `/context/${id}`
  }, "Context"))), React.createElement(Image, {
    maxSizeKo: 300,
    node: node.get("image")
  }), React.createElement("h2", null, "CO-WRITE THE STORY!"), React.createElement(ContextParagraphs, {
    node
  }));
};
export default () => {
  return React.createElement(Router, {
    basepath: location.pathname
  }, React.createElement(Route, {
    path: "/",
    component: Pages
  }), React.createElement(Route, {
    path: "/about",
    component: About
  }), React.createElement(Route, {
    path: "/fiction/:key"
  }, ({key}) => React.createElement(Page, {
    id: key,
    node: gun.get("pages").get(key)
  })), React.createElement(Route, {
    path: "/context/:key"
  }, ({key}) => React.createElement(Context, {
    id: key,
    node: gun.get("pages").get(key)
  })));
};
