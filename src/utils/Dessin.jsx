import React, { useState, useRef, useMemo } from "react";
import { useGunState, useGunSetState } from "../App.jsx";
import { classs } from "./utils.js";

export default ({ node }) => {
  const key = "dessins-4";
  const dessins = useGunSetState(node.get(key));
  console.log(dessins);
  const create = () =>
    node.get(key).set({
      createdAt: new Date().toISOString(),
    });
  return (
    <>
      {dessins.map((id) => (
        <Dessin key={id} node={node.get(key).get(id)} />
      ))}
      <Locker node={node.get(key)}>
        {(locked) =>
          !locked &&
          dessins.length < 1 && <button onClick={create}>Add a draw</button>
        }
      </Locker>
    </>
  );
};

const Locker = ({ node, className, children }) => {
  const locked = useGunState(node.get("locked"));
  return (
    <div className={classs({ locked }, className)}>
      {!locked ? (
        <>
          {children(locked)}
          <button onClick={() => node.get("locked").put(true)}>Lock</button>
          <button onClick={() => node.back().unset(node)}>Remove</button>
        </>
      ) : (
        children(locked)
      )}
    </div>
  );
};

const getPath = (points) =>
  points.reduce(
    (acc, [mode, x, y], i) =>
      i === 0 ? `M${x},${y}` : `${acc}${mode || "L"}${x} ${y}`,
    ""
  );

const normalize = (target, { clientX, clientY }) => {
  // Use the target from event, funny results !
  const { left, top, height, width } = target.getBoundingClientRect();
  return [(clientX - left) / width, (clientY - top) / height];
};

let time = 0;
const Dessin = ({ node }) => {
  const svg = useRef();
  const path = useRef();
  const [record, setRecord] = useState(false);
  const [mode, setMode] = useState("M");
  const onClick = () => setRecord((prev) => !prev);

  const str = useGunState(node.get("points"), "[]");
  const points = useMemo(
    () => (str ? JSON.parse(str).slice(0).slice(-200) : []),
    [str]
  );
  const d = useMemo(() => getPath(points), [points]);

  const onMove = (e) => {
    const delta = Date.now() - time;
    if (delta > 50) {
      if (record) {
        const [x, y] = normalize(svg.current, e).map((p) =>
          Math.floor(p * 100)
        );
        const newP = [...points, [mode, x, y]];
        node.get("points").put(JSON.stringify(newP));
        setMode("L");
        time = Date.now();
      } else setMode("M");
    }
  };

  return (
    <Locker className={"svg"} node={node}>
      {(locked) =>
        locked ? (
          <svg viewBox={`0 0 100 100`} namespace="http://www.w3.org/2000/svg">
            <path stroke-width="0.15" d={d}></path>
          </svg>
        ) : (
          <svg
            ref={svg}
            viewBox={`0 0 100 100`}
            namespace="http://www.w3.org/2000/svg"
            onClick={onClick}
            onMouseMove={onMove}
            onTouchStart={onClick}
            onTouchEnd={onClick}
            onTouchMove={(e) => onMove(e.touches[0])}
          >
            <path stroke-width="0.15" ref={path} d={d}></path>
          </svg>
        )
      }
    </Locker>
  );
};
