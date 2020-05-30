import React, { useState, useEffect, useMemo } from "react";

import { useGunSetState, useGunState } from "../utils/gun-hooks.js";
import { byCreateAt } from "../utils/utils.js";

import { Sentence, Blank } from "./Text.jsx";
import Dessins from "./Dessin.jsx";

const isType = (t) => ({ data: { type } }) => type === t;

const Paragraph = ({ node, remove }) => {
  const [gaps, setGaps] = useGunSetState(node.get("gaps"));
  const [values] = useGunSetState(node.get("gaps").map().get("values"));
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const [valid, setValid] = useState(true);

  useEffect(() => setValid((prev) => gaps.length === 0 || prev), [gaps]);

  const blanks = useMemo(() => gaps.filter(isType("blank")).length, [gaps]);
  const texts = useMemo(() => gaps.filter(isType("text")).length, [gaps]);

  const add = (type, placeholder) =>
    setGaps({
      createdAt: new Date().toISOString(),
      locked: false,
      type,
      placeholder,
    });

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
            <button
              disabled={!(texts < 2)}
              onClick={() => add("text", "Continue the story...")}
            >
              Add A Text
            </button>
            <button
              disabled={!(blanks < 1)}
              onClick={() => add("blank", "write something here...")}
            >
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

export default ({ node }) => {
  const [paragraphs, setParagraphs] = useGunSetState(node.get("paragraphs"));
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
