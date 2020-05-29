import React, { useState, useEffect, useRef } from "react";
import { Link, Route, Router } from "wouter";

import Dessin from "./utils/Dessin.jsx";
import { classs, setCaretNode, formatDate, toBase64 } from "./utils/utils.js";

const gun = window.Gun({ peers: ["http://127.0.0.1:8765/gun"] }).get(12);
const session = new Date().toISOString();

export const useGunState = (node, initialState = undefined) => {
  const [graph] = useState(node);
  const [value, setValue] = useState(initialState);
  useEffect(() => {
    const listener = graph.on((value) => setValue(value));
    return () => listener.off();
  }, [node]);
  return value;
};

export const useGunSetState = (node) => {
  const [set, setSet] = useState([]);
  const add = (id) => (prev) => [...prev, id];
  const remove = (id) => (p) => p.filter((i) => i !== id.split("/").pop());
  const register = (_, id) => (_ ? setSet(add(id)) : setSet(remove(id)));
  useEffect(() => {
    const listener = node.map().once(register);
    return () => listener.off();
  }, [node]);
  return set;
};

const Editable = ({ current = "", placeholder, setCurrent }) => {
  const ref = useRef();
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    ref.current.innerText = placeholder;
  }, []);
  useEffect(() => {
    if (focus) setCaretNode(ref.current, -1);
    if (focus && ref.current.innerText === placeholder)
      ref.current.innerText = "";
    else if (!focus && ref.current.innerText === "")
      ref.current.innerText = placeholder;
  }, [focus]);
  useEffect(() => {
    if (!focus && current && current != placeholder)
      ref.current.innerText = current;
  }, [current, focus]);
  return (
    <span
      ref={ref}
      contentEditable={true}
      // onKeyDown={(e) => e.keyCode === 13 && e.preventDefault()}
      onKeyUp={() => {
        if (!["", placeholder].includes(ref.current.innerText))
          setCurrent(ref.current.innerText);
        else setCurrent(null);
      }}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    ></span>
  );
};

const Gap = ({ node, onValid, onRemove, locked }) => {
  const type = useGunState(node.get("type"));
  const id = type === "blank" ? session : "text";
  const current = useGunState(node.get("current").get(id));
  const placeholder = useGunState(node.get("placeholder"), "");
  const setCurrent = (value) => {
    node.get("current").get(id).put(value);
    type === "blank" && node.get("values").get(session).put(value);
  };
  const editable = (locked && type === "blank") || (!locked && type === "text");
  useEffect(() => onValid(!editable || current), [current, editable]);

  return (
    <>
      <span className={classs({ editable }, type)}>
        {editable ? (
          <Editable
            onValid={onValid}
            setCurrent={setCurrent}
            current={current}
            placeholder={placeholder}
          />
        ) : (
          <span>{current ?? placeholder}</span>
        )}
        {!locked && (
          <button onClick={() => onValid(true) || onRemove(node)}>-</button>
        )}
      </span>
    </>
  );
};

const GapValue = ({ node }) => {
  const value = useGunState(node);
  return <li>{value}</li>;
};

const GapValues = ({ node }) => {
  const values = useGunSetState(node.get("values"));

  return (
    <>
      {values.map((id) => (
        <GapValue node={node.get("values").get(id)} />
      ))}
    </>
  );
};

const Paragraph = ({ node }) => {
  const gaps = useGunSetState(node.get("gaps"));
  const locked = useGunState(node.get("locked"), true);
  const [valid, setValid] = useState(true);
  const lock = () => node.get("locked").put(true);
  const getGapFromId = (id) => node.get("gaps").get(id);
  const removeGap = (child) => node.get("gaps").unset(child);
  const createGap = () =>
    node.get("gaps").set({
      type: gaps.length % 2 ? "blank" : "text",
      placeholder:
        gaps.length % 2 ? "write something here" : "Continue the story...",
    });

  return (
    <>
      <p>
        {gaps.map((id) => (
          <Gap
            key={id}
            locked={locked}
            node={getGapFromId(id)}
            onValid={setValid}
            onRemove={removeGap}
          />
        ))}
        {!locked && (
          <div className="controls">
            <button disabled={!(valid && gaps.length < 3)} onClick={createGap}>
              Add a Gap
            </button>
            <button disabled={!(valid && gaps.length > 1)} onClick={lock}>
              Lock
            </button>
          </div>
        )}
      </p>
      {gaps.map((id) => (
        <GapValues node={getGapFromId(id)} id={id} />
      ))}
      {/* <Dessin node={node} /> */}
    </>
  );
};

const Text = ({ node, placeholder = "Write something here..." }) => {
  const title = useGunState(node.get("current"));
  const locked = useGunState(node.get("locked"));

  return !locked ? (
    <span>
      <Editable
        current={title}
        placeholder={placeholder}
        setCurrent={(value) => node.get("current").put(value)}
      />
      <button onClick={() => node.get("locked").put(true)}>Lock</button>
    </span>
  ) : (
    <span>{title}</span>
  );
};

const Page = ({ node }) => {
  const createdAt = useGunState(node.get("createdAt"));
  const image = useGunState(node.get("image").get("src"));
  const lockedImage = useGunState(node.get("image").get("locked"));
  const paragraphs = useGunSetState(node.get("paragraphs"));
  const create = () =>
    node.get("paragraphs").set({
      createdAt: new Date().toISOString(),
      locked: false,
    });

  const addImage = async (file) => {
    const maxSizeKo = 300;
    const sizeKo = parseInt(file.size / 1000);
    if (sizeKo > maxSizeKo)
      alert(`Image too big (${sizeKo} ko > ${maxSizeKo} ko)`);
    else node.get("image").put({ src: await toBase64(file) });
  };

  return (
    <>
      <h1>
        <span>Care Fiction:</span>
        <Text node={node.get("title")} placeholder={"Enter A Title"} />
      </h1>
      {image ? (
        <div className={classs({ locked: lockedImage }, "image")}>
          <img src={image} />
          {!lockedImage && (
            <>
              <button onClick={() => node.get("image").get("src").put(null)}>
                Remove
              </button>
              <button onClick={() => node.get("image").get("locked").put(true)}>
                Lock
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="image">
          <input
            onChange={(e) => addImage(e.target.files[0])}
            type="file"
            accept="image/*"
          ></input>
        </div>
      )}
      <h2>
        <Text node={node.get("subtitle")} placeholder={"Enter A Subtitle"} />
      </h2>
      <time datetime={createdAt}>{formatDate(createdAt)}</time>
      {paragraphs.map((id) => (
        <Paragraph key={id} node={node.get("paragraphs").get(id)} />
      ))}
      <div className="controls">
        <button onClick={create}>Add A Thought</button>
      </div>
    </>
  );
};

const GunLink = ({ id, node }) => {
  return (
    <Link href={`/fiction/${id}`}>
      <a>{id}</a>
    </Link>
  );
};

const Pages = () => {
  const pages = useGunSetState(gun.get("pages"));

  const create = () =>
    gun.get("pages").set({
      createdAt: new Date().toISOString(),
    });

  return (
    <>
      <div className="controls">
        <button onClick={create}>Add A New Fiction</button>
      </div>
      {pages.map((id) => (
        <GunLink key={id} id={id} node={gun.get("pages").get(id)} />
      ))}
    </>
  );
};

export default () => {
  return (
    <Router basepath={location.pathname}>
      <Route path="/" component={Pages} />
      <Route path="/about">About Us</Route>
      <Route path="/fiction/:id">
        {({ id }) => <Page node={gun.get("pages").get(id)} />}
      </Route>
    </Router>
  );
};
