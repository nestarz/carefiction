import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, Route, Router } from "wouter";

import Editable from "./utils/Edtiable.jsx";
import Dessin from "./utils/Dessin.jsx";

import { useGunSetState, useGunState } from "./utils/gun-hooks.js";
import { classs, formatDate, toBase64 } from "./utils/utils.js";

const session = new Date().toISOString();

const gun = window
  .Gun({
    peers: [
      "http://gunjs.herokuapp.com/gun",
      "https://gun.eliasrhouzlane.com/gun",
      "http://carefiction-gun.herokuapp.com/gun",
    ],
  })
  .get("alpha-0");

const Blank = ({ node, lock, remove }) => {
  const [placeholder, setPlaceholder] = useGunState(node.get("placeholder"));
  const [current, setCurrent] = useGunState(node.get(session).get("current"));
  const [_, setValue] = useGunState(node.get("values").get(session));
  useEffect(() => {
    if (current)
      setValue({ createdAt: new Date().toISOString(), value: current });
  }, [current]);
  return (
    <span className="blank">
      {lock ? (
        <Editable
          current={current}
          placeholder={placeholder}
          setCurrent={setCurrent}
        />
      ) : (
        <>
          <Editable
            current={placeholder}
            placeholder={"write something here"}
            setCurrent={setPlaceholder}
          />
          <button onClick={remove}>Remove The Blank</button>
        </>
      )}
    </span>
  );
};

const Sentence = ({ node, lock, remove, onValid }) => {
  const [placeholder] = useGunState(node.get("placeholder"));
  const [current, setCurrent] = useGunState(node.get("current"));
  const [bold, setBold] = useGunState(node.get("bold"));
  useEffect(() => onValid(current !== placeholder && current), [current]);
  return lock ? (
    <span className={classs({ bold })}>{current}</span>
  ) : (
    <>
      <Editable
        className={classs({ bold })}
        current={current}
        placeholder={placeholder}
        setCurrent={setCurrent}
      />
      <button onClick={() => setBold(!bold)}>{`${
        bold ? "Remove" : "Add"
      } Emphasis`}</button>
      <button onClick={remove}>Remove The Text</button>
    </>
  );
};

const isType = (t) => ({ data: { type } }) => type === t;
const byCreateAt = ({ data: { createdAt: a } }, { data: { createdAt: b } }) =>
  +Date.parse(a) > +Date.parse(b);

const Paragraph = ({ node, remove }) => {
  const [gaps, setGaps] = useGunSetState(node.get("gaps"));
  const [values] = useGunSetState(node.get("gaps").map().get("values"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const [valid, setValid] = useState(true);
  useEffect(() => setValid((prev) => gaps.length === 0 || prev), [gaps]);
  const blanks = useMemo(() => gaps.filter(isType("blank")).length);
  const texts = useMemo(() => gaps.filter(isType("text")).length);

  const add = (type, placeholder) =>
    setGaps({
      createdAt: new Date().toISOString(),
      locked: false,
      type,
      placeholder,
    });
  const addText = () => add("text", "Continue the story...");
  const addBlank = () => add("blank", "write something here...");

  return (
    <>
      <p>
        {gaps
          .sort(byCreateAt)
          .map(({ data, ...props }) =>
            data.type === "text" ? (
              <Sentence {...props} lock={lock} onValid={setValid} />
            ) : (
              <Blank {...props} lock={lock} />
            )
          )}
        {!lock && (
          <>
            <button disabled={!(texts < 2)} onClick={addText}>
              Add A Text
            </button>
            <button disabled={!(blanks < 1)} onClick={addBlank}>
              Add A Blank
            </button>
          </>
        )}
      </p>
      {values
        .sort(byCreateAt)
        .map(({ data: { value } }) => value && <li>{value}</li>)}
      <Dessins node={node} lock={lock} />
      {!lock && (
        <>
          <button
            disabled={!(valid && gaps.length !== 0)}
            onClick={() => setLock(true)}
          >
            Lock The Paragraph
          </button>
          <button onClick={remove}>Remove The Paragraph</button>
        </>
      )}
    </>
  );
};

const Dessins = ({ node, lock }) => {
  const [dessins, setDessins] = useGunSetState(node.get("dessins2"));
  const add = () => setDessins({ createdAt: new Date().toISOString() });
  return (
    <>
      {dessins.sort(byCreateAt).map(({ key, node, remove }) => (
        <Dessin key={key} node={node} remove={remove} />
      ))}
      {!lock && dessins.length === 0 && (
        <button onClick={add}>Add A Drawing</button>
      )}
    </>
  );
};

const Paragraphs = ({ node }) => {
  const [paragraphs, setParagraphs] = useGunSetState(node.get("paragraphs4"));
  const add = () =>
    setParagraphs({ createdAt: new Date().toISOString(), lock: false });
  return (
    <>
      {paragraphs.sort(byCreateAt).map(({ key, node, remove }) => (
        <Paragraph key={key} node={node} remove={remove} />
      ))}
      <button onClick={add}>Add A Paragraph</button>
    </>
  );
};

const Text = ({ node, placeholder = "Write something here..." }) => {
  const [title, setTitle] = useGunState(node.get("current"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  return !lock ? (
    <span>
      <Editable
        current={title}
        placeholder={placeholder}
        setCurrent={setTitle}
      />
      <button onClick={() => setLock(true)}>Lock</button>
    </span>
  ) : (
    <span>{title}</span>
  );
};

const Image = ({ node, maxSizeKo = 0 }) => {
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
    <div className={classs({ lock, empty: !src }, "image")}>
      {src ? (
        <>
          <img src={src} />
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
    </div>
  );
};

const Page = ({ id, node }) => {
  const [createdAt] = useGunState(node.get("createdAt"));
  return (
    <>
      <h1>
        <span>Care Fiction:</span>
        <Text node={node.get("title")} placeholder={"Enter A Title"} />
      </h1>
      <ol start="0">
        <li>
          <Link href="/about/">Intro</Link>
        </li>
        <li className="active">
          <a href="#">First visit</a>
        </li>
        <li>
          <Link href={`/context/${id}`}>Context</Link>
        </li>
      </ol>
      <Image maxSizeKo={300} node={node.get("image")} />
      <h2>
        {/* <Text node={node.get("subtitle")} placeholder={"Enter A Subtitle"} /> */}
      </h2>
      <time datetime={createdAt}>{formatDate(createdAt)}</time>
      <Paragraphs node={node} />
    </>
  );
};

const Pages = () => {
  const [pages, setPages] = useGunSetState(gun.get("pages"));
  const add = () =>
    setPages({ createdAt: new Date().toISOString(), lock: false });

  console.log(pages);
  return (
    <>
      <button onClick={add}>Add A New Fiction</button>
      {pages.sort(byCreateAt).map(({ key }) => (
        <Link href={`/fiction/${key}`}>
          <a>{key}</a>
        </Link>
      ))}
    </>
  );
};

const About = () => {
  return (
    <>
      <h1>
        <span>CARE FICTION:</span>
        <span>A PLAYGROUND FOR COMMONERS</span>
      </h1>
      <h2>Welcome!</h2>
      <p>
        <i>Care Fiction</i> is the prototype of a playground for collaborative
        dreaming, envisioning, conceiving, projecting. It all starts with a
        targeted resource, or commons. We invite our guests to react to an
        existing value, by pouring their ideas, resources, scenarios, inside the
        container.
      </p>
      <p>
        Our generative fiction tool will combine all contributions and produce
        an ever changing story. The more we all add, the more the story becomes
        richer, and selected. May the dream breach through the screen and become
        real.
      </p>
    </>
  );
};

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

const Video = ({ node }) => {
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

const ContextParagraph = ({ node, remove }) => {
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const [withImage, setWithImage] = useGunState(node.get("withImage"), false);
  const [withVideo, setWithVideo] = useGunState(node.get("withVideo"), false);
  const [valid, setValid] = useState(false);

  return (
    <>
      <p className="context">
        <Sentence node={node} onValid={setValid} lock={lock} />
      </p>
      {!lock && (
        <>
          <button disabled={!valid} onClick={() => setLock(true)}>
            Lock The Paragraph
          </button>
          <button onClick={remove}>Remove The Paragraph</button>
          {!withVideo && (
            <button onClick={() => setWithImage(!withImage)}>
              {withImage ? "Remove" : "Add"} Image
            </button>
          )}
          {!withImage && (
            <button onClick={() => setWithVideo(!withVideo)}>
              {withVideo ? "Remove" : "Add"} Video
            </button>
          )}
        </>
      )}
      {withVideo && <Video node={node.get("video")} />}
      {withImage && <Image maxSizeKo={500} node={node.get("image")} />}
    </>
  );
};

const ContextParagraphs = ({ node }) => {
  const [texts, setTexts] = useGunSetState(node.get("context").get("texts"));
  const add = () =>
    setTexts({
      createdAt: new Date().toISOString(),
      placeholder: "Write a text",
      lock: false,
    });
  return (
    <>
      {texts.map(({ ...props }) => (
        <ContextParagraph {...props} />
      ))}
      <button onClick={add}>Add A New Paragraph</button>
    </>
  );
};

const Context = ({ id, node }) => {
  return (
    <>
      <h1>
        <span>Care Fiction:</span>
        <Text node={node.get("title")} placeholder={"Enter A Title"} />
      </h1>
      <ol start="0">
        <li>
          <Link href="/about/">Intro</Link>
        </li>
        <li>
          <Link href={`/fiction/${id}`}>First visit</Link>
        </li>
        <li className="active">
          <Link href={`/context/${id}`}>Context</Link>
        </li>
      </ol>
      <Image maxSizeKo={300} node={node.get("image")} />
      <h2>CO-WRITE THE STORY!</h2>
      <ContextParagraphs node={node} />
    </>
  );
};

export default () => {
  // const lol = useGun();
  return (
    <Router basepath={location.pathname}>
      <Route path="/" component={Pages} />
      <Route path="/about" component={About}></Route>
      <Route path="/fiction/:key">
        {({ key }) => <Page id={key} node={gun.get("pages").get(key)} />}
      </Route>
      <Route path="/context/:key">
        {({ key }) => <Context id={key} node={gun.get("pages").get(key)} />}
      </Route>
    </Router>
  );
};
