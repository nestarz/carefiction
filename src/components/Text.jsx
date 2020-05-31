/* @jsx h */
import { h, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";

import { useGunState } from "../utils/gun-hooks.js";
import { classs } from "../utils/utils.js";

import Editable from "./Edtiable.jsx";
import { session } from "../App.jsx";

export const Blank = ({ node, lock, remove }) => {
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

export const Sentence = ({ node, lock, remove, onValid }) => {
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

export const Text = ({ node, placeholder = "Write something here..." }) => {
  const [current, setCurrent] = useGunState(node.get("current"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const [valid, setValid] = useState(false);

  return !lock ? (
    <span>
      <Editable
        current={current}
        placeholder={placeholder}
        setCurrent={setCurrent}
        onValid={setValid}
      />
      <button disabled={!valid} onClick={() => setLock(true)}>
        Lock
      </button>
    </span>
  ) : (
    <span>{current}</span>
  );
};
