import {h, Fragment} from "preact";
import {useState, useRef, useMemo} from "preact/hooks";
import {useGunSetState, useGunState} from "./../../../src/utils/gun-hooks.js";
import {classs, byCreateAt} from "./../../../src/utils/utils.js";
const getPath = (points) => points.reduce((acc, [mode, x, y], i) => i === 0 ? `M${x},${y}` : `${acc}${mode || "L"}${x} ${y}`, "");
const getProj = (svg, x, y) => {
  const CTM = svg.getScreenCTM();
  const point = Object.assign(svg.createSVGPoint(), {
    x,
    y
  });
  const {x: projX, y: projY} = point.matrixTransform(CTM.inverse());
  return [projX, projY];
};
let time = 0;
const Dessin = ({node, remove}) => {
  const [str, setStr] = useGunState(node.get("points"));
  const [lock, setLock] = useGunState(node.get("lock"));
  const [editable, setEditable] = useGunState(node.get("editable"));
  const points = useMemo(() => str ? JSON.parse(str).slice(0).slice(-600) : [], [str]);
  const d = useMemo(() => getPath(points), [points]);
  const svg = useRef();
  const path = useRef();
  const [record, setRecord] = useState(false);
  const [mode, setMode] = useState("M");
  const onClick = () => setRecord((prev) => !prev);
  const onMove = ({clientX, clientY}) => {
    const delta = Date.now() - time;
    if (delta > 5) {
      if (record) {
        const [x, y] = getProj(svg.current, clientX, clientY).map((x2) => Math.floor(x2 * 100) / 100);
        setStr(JSON.stringify([...points, [mode, x, y]]));
        setMode("L");
        time = Date.now();
      } else
        setMode("M");
    }
  };
  return h(Fragment, null, !lock && h("div", {
    className: "drawing-controls"
  }, h("button", {
    onClick: () => setEditable(!editable)
  }, !editable ? "Make it editable" : "Make it fixed"), h("button", {
    disabled: points.length < 10,
    onClick: () => setLock(true)
  }, "Lock The Drawing"), h("button", {
    onClick: remove
  }, "Remove The Drawing")), !editable ? h("svg", {
    viewBox: `0 0 100 100`,
    namespace: "http://www.w3.org/2000/svg"
  }, h("path", {
    "stroke-width": "0.3",
    d
  })) : h("svg", {
    className: classs({
      lock,
      editable
    }),
    ref: svg,
    viewBox: `0 0 100 100`,
    namespace: "http://www.w3.org/2000/svg",
    onClick,
    onMouseMove: onMove,
    onTouchStart: onClick,
    onTouchEnd: onClick,
    onTouchMove: (e) => onMove(e.touches[0])
  }, h("path", {
    "stroke-width": "0.3",
    ref: path,
    d
  })));
};
export default ({node, lock}) => {
  const [dessins, setDessins] = useGunSetState(node.get("dessins"));
  const add = () => setDessins({
    createdAt: new Date().toISOString()
  });
  return h(Fragment, null, dessins.sort(byCreateAt).map(({key, node: node2, remove}) => h(Dessin, {
    key,
    node: node2,
    remove
  })), !lock && dessins.length === 0 && h("button", {
    onClick: add
  }, "Add A Drawing"));
};
