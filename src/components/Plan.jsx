/* @jsx h */
import { h, Fragment } from "preact";
import { useEffect } from "preact/hooks";

import { useGunSetState, useGunState } from "../utils/gun-hooks.js";
import { byCreateAt, classs } from "../utils/utils.js";

import Editable from "./Edtiable.jsx";
import Image from "./Image.jsx";
import { session } from "../App.jsx";

export const Blank = ({ node, remove }) => {
  const [lock, setLock] = useGunState(node.get("lock"));
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
          <button onClick={() => setLock(true)}>Lock The Blank</button>
        </>
      )}
    </span>
  );
};

const normalize = (target, { clientX, clientY }) => {
  const { left, top, height, width } = target.getBoundingClientRect();
  return [(clientX - left) / width, (clientY - top) / height];
};

const Landmark = ({ data, remove, key, node, index }) => {
  const [values] = useGunSetState(node.get("values"));

  return (
    <span style={{ left: `${data.x * 100}%`, top: `${data.y * 100}%` }}>
      <span>{index + 1}</span>
      <Blank key={key} node={node} remove={remove} />
      <ul className="answers">
        {values
          .sort((a, b) => !byCreateAt(a, b))
          .map(
            ({ key, data: { value } }) => value && <li key={key}>{value}</li>
          )}
      </ul>
    </span>
  );
};

const Plan = ({ node, remove }) => {
  const [lock, setLock] = useGunState(node.get("plans"));
  const [landmarks, setLandmarks] = useGunSetState(node.get("landmarks"));

  const setLandmark = (e) => {
    if (lock) return;
    const [x, y] = normalize(e.target, e);
    console.log(x, y);
    setLandmarks({ createdAt: new Date().toISOString(), x, y });
  };
  return (
    <>
      <Image
        className={classs("landmark-container", { lock })}
        maxSizeKo={300}
        node={node.get("image")}
        onClick={setLandmark}
      >
        {landmarks.map(({ key, data, remove, node }, index) => (
          <Landmark
            data={data}
            key={key}
            remove={remove}
            node={node}
            index={index}
          />
        ))}
      </Image>
      {/* {landmarks.map(({ key, node, data }, index) => {
        const [values] = useGunSetState(node.get("values"));
        return (
          <>
            <p key={key}>
              <span>{data.placeholder}</span>
            </p>
            {values
              .sort(byCreateAt)
              .map(
                ({ key, data: { value } }) =>
                  value && <li key={key}>{value}</li>
              )}
          </>
        );
      })} */}
      {!lock && (
        <>
          <button onClick={() => setLock(true)}>Lock The Plan</button>
          <button onClick={remove}>Remove The Plan</button>
        </>
      )}
    </>
  );
};

export default ({ node }) => {
  const [plans, setPlans] = useGunSetState(node.get("plans"));
  const add = () =>
    setPlans({ createdAt: new Date().toISOString(), lock: false });

  return (
    <>
      {plans.sort(byCreateAt).map(({ key, node, remove }) => (
        <Plan key={key} node={node} remove={remove} />
      ))}
      <button onClick={add}>Add a plan</button>
    </>
  );
};
