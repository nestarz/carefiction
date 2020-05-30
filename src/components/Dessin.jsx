/* @jsx h */
import { h, Fragment } from "preact";
import { useState, useRef, useMemo } from "preact/hooks";
import { useGunSetState, useGunState } from "../utils/gun-hooks.js";
import { classs, byCreateAt } from "../utils/utils.js";

const getPath = (points) =>
  points.reduce(
    (acc, [mode, x, y], i) =>
      i === 0 ? `M${x},${y}` : `${acc}${mode || "L"}${x} ${y}`,
    ""
  );

const getProj = (svg, x, y) => {
  const CTM = svg.getScreenCTM();
  const point = Object.assign(svg.createSVGPoint(), { x, y });
  const { x: projX, y: projY } = point.matrixTransform(CTM.inverse());
  return [projX, projY];
};

let time = 0;
const Dessin = ({ node, remove }) => {
  const [str, setStr] = useGunState(node.get("points"));
  const [lock, setLock] = useGunState(node.get("lock"));
  const [editable, setEditable] = useGunState(node.get("editable"));

  const points = useMemo(
    () => (str ? JSON.parse(str).slice(0).slice(-200) : []),
    [str]
  );
  const d = useMemo(() => getPath(points), [points]);

  const svg = useRef();
  const path = useRef();
  const [record, setRecord] = useState(false);
  const [mode, setMode] = useState("M");
  const onClick = () => setRecord((prev) => !prev);

  const onMove = ({ clientX, clientY }) => {
    const delta = Date.now() - time;
    if (delta > 50) {
      if (record) {
        const [x, y] = getProj(svg.current, clientX, clientY).map(Math.floor);
        setStr(JSON.stringify([...points, [mode, x, y]]));
        setMode("L");
        time = Date.now();
      } else setMode("M");
    }
  };

  return (
    <>
      {!lock && (
        <div className="drawing-controls">
          <button onClick={() => setEditable(!editable)}>
            {!editable ? "Make it editable" : "Make it fixed"}
          </button>
          <button disabled={points.length < 10} onClick={() => setLock(true)}>
            Lock The Drawing
          </button>
          <button onClick={remove}>Remove The Drawing</button>
        </div>
      )}
      {!editable ? (
        <svg viewBox={`0 0 100 100`} namespace="http://www.w3.org/2000/svg">
          <path stroke-width="0.2" d={d}></path>
        </svg>
      ) : (
        <svg
          className={classs({ lock, editable })}
          ref={svg}
          viewBox={`0 0 100 100`}
          namespace="http://www.w3.org/2000/svg"
          onClick={onClick}
          onMouseMove={onMove}
          onTouchStart={onClick}
          onTouchEnd={onClick}
          onTouchMove={(e) => onMove(e.touches[0])}
        >
          <path stroke-width="0.2" ref={path} d={d}></path>
        </svg>
      )}
    </>
  );
};

export default ({ node, lock }) => {
  const [dessins, setDessins] = useGunSetState(node.get("dessins"));
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
