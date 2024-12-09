import { useState, useRef, useMemo } from "preact/hooks";
import { useGunState } from "../utils/gun-hooks.js";
import { classs } from "../utils/utils.js";

const p = (i) => i || 0;
const getPath = (points) =>
  points.reduce(
    (acc, [mode, x, y], i) =>
      i === 0 ? `M${p(x)},${p(y)}` : `${acc}${mode || "L"}${p(x)},${p(y)}`,
    ""
  );

const getProj = (svg, x, y) => {
  const CTM = svg.getScreenCTM();
  const point = Object.assign(svg.createSVGPoint(), { x, y });
  const { x: projX, y: projY } = point.matrixTransform(CTM.inverse());
  return [projX, projY];
};

const unparse = (str) =>
  [
    ...str.matchAll(
      /([A-Z]-?\d*\.{0,1}\d+\.?-?\d*\.{0,1}\d+,-?\d*\.{0,1}\d+\.?-?\d*\.{0,1}\d+)/g
    ),
  ].map((x) =>
    [x[0][0], ...x[0].substring(1).split(",")].map((y) => (+y ? +y : y))
  );

let time = 0;
export default ({ node, remove }) => {
  const [str, setStr] = useGunState(node.get("points"));
  const [lock, setLock] = useGunState(node.get("lock"));
  const [nonEditable, setNonEditable] = useGunState(node.get("non-editable"));

  const points = useMemo(
    () => (str ? unparse(str).slice(0).slice(-1600) : []),
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
    if (delta > 40) {
      if (record) {
        const [x, y] = getProj(svg.current, clientX, clientY).map((x) =>
          Math.floor(x)
        );
        setStr(getPath([...points, [mode, x, y]]));
        setMode("L");
        time = Date.now();
      } else setMode("M");
    }
  };

  return (
    <>
      {!lock && (
        <div className="before-lock">
          <button onClick={remove}>✕</button>
          <button disabled={points.length < 10} onClick={() => setLock(true)}>
            {lock ? "🔒" : "🔓"}
          </button>
          <button onClick={() => setNonEditable(!nonEditable)}>
            {nonEditable ? "☉" : "✎"}
          </button>
        </div>
      )}
      {nonEditable ? (
        <svg viewBox={`0 0 1000 1000`} namespace="http://www.w3.org/2000/svg">
          <path stroke-width="3" d={d}></path>
        </svg>
      ) : (
        <svg
          className={classs({ lock, editable: !nonEditable })}
          ref={svg}
          viewBox={`0 0 1000 1000`}
          namespace="http://www.w3.org/2000/svg"
          onClick={onClick}
          onMouseMove={onMove}
          onTouchStart={onClick}
          onTouchEnd={onClick}
          onTouchMove={(e) => onMove(e.touches[0])}
        >
          <path stroke-width="3" ref={path} d={d}></path>
        </svg>
      )}
    </>
  );
};
