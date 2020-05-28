import React, { useState, useEffect } from "react";
import { classs, setText } from "./utils/utils.js";

const gun = window.Gun();
const base = Math.random().toString();

const Editable = ({ id, className, init = "write something here" }) => {
  const [editable, set] = useGun({ table: "editable" });

  return (
    <span id={id} className={classs(className, "editable")}>
      <span
        contenteditable="true"
        onKeyUp={(e) => e.keyCode === 13 && set(e.target.textContent)}
        onKeyDown={(e) => e.keyCode === 13 && e.preventDefault()}
        onFocus={({ target }) => setText(target, "", init)}
        onBlur={({ target }) => setText(target, init, "")}
      >
        {editable || init}
      </span>
    </span>
  );
};

const Entries = ({ id }) => {
  const [entries] = useGun({ table: "entries" });
  return entries.map((entry) => <li>{JSON.stringify(entry)}</li>);
};

const Gap = ({ id, editable = true }) => {
  const [gap, setGap] = useGun({ table: "gap" });
  return (
    <>
      <p>
        <Editable id="non" />
        {gap.map(([id]) => (
          <>
            <Editable id={id} className="blank" id="non" />
            <Editable id={id} />
          </>
        ))}
        {editable && (
          <>
            <button onClick={() => setGap({})}>Add</button>
            {/* <button onClick={() => setGap({})}>Remove</button> */}
          </>
        )}
      </p>
      <Entries id="test" />
    </>
  );
};

const useGunState = (root) => {
  const [graph] = useState(root);
  const [value, setValue] = useState(null);
  useEffect(() => graph.on((value) => setValue(value)).off, [root]);
  return [value, () => root.put];
};


const Gaps = () => {
  const [gun] = useState(Gun({ peers }));
  const [gaps, put] = useGunState(gun.get("gaps"));
  return (
    <>
      {gaps.map(([id, gap]) => (
        <Gap onCreated={(node) => gun.get("gaps").put(node)} id={id} {...gap} />
      ))}
      <button onClick={() => gun.get("gap").get(id).put({ name: "Bob" })}>
        Add
      </button>
    </>
  );
};

export default () => (
  <>
    <h1>
      <span>Care Fiction:</span>
      <span>The White House</span>
    </h1>
    <img src="assets/images/white_house.jpg" />
    <h2>Dreams of Commoning</h2>
    <time datetime="2021-05-23">23 May 2021</time>
    <p>
      It's a Sunday, you're biking around Eindhoven. While turning around a
      corner you notice a big white house. It seems busy inside and a few people
      are chatting animatedly in the garden. <br /> It seems like someone is
      {/* building a <Editable id="test" parent={false} />. */}
    </p>
    <li>porch</li>
    <li>table</li>
    <li>a set of benches</li>
    <li>a makeshift stage</li>
    <li>a weird sculpture</li>
    {/* <Entries id="test" /> */}
    <Gaps />
  </>
);
