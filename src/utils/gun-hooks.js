import { useState, useEffect } from "preact/hooks";

const getId = (key) => key.split("/").pop();

export const useGunSetState = (node) => {
  const [set, setSet] = useState([]);
  const add = (data, key) => (prev) => {
    const child = node.get(key);
    return [
      ...prev.filter((i) => i.key !== getId(key)),
      {
        key,
        node: child,
        remove: () => child.back().get(key).put(null),
        data,
      },
    ];
  };
  const remove = (k) => (p) => p.filter((i) => i.key !== getId(k));
  const register = (data, key) => {
    return data ? setSet(add(data, key)) : setSet(remove(key));
  };
  useEffect(() => {
    let event;
    node.map().on((data, key, _, e) => {
      event = e;
      register(data, key);
    });
    return () => {
      event?.off();
      setSet([]);
    };
  }, [node]);
  return [set, (value) => node.set(value)];
};

export const useGunState = (node, initialState = undefined) => {
  const [value, setValue] = useState(initialState);
  useEffect(() => {
    let event;
    node.once((data) => setValue(data));
    node.on((data, _, __, e) => {
      event = e;
      setValue(data);
    });
    return () => {
      event?.off();
      setValue(initialState);
    };
  }, [node]);
  return [value, (value) => node.put(value)];
};

// export const gunWorker = (worker, key = "100") => ({
//   worker,
//   get: (next) =>
//     worker.get([key, next].join("/")) ||
//     gunWorker(worker, [key, next].join("/")),
//   put: (data) => worker.put(key, data) || gunWorker(worker, key),
// });

// export const useGun = () => {
//   const worker = new Worker("/src/utils/gun-worker.js");
//   worker.addEventListener("message", (e) => {
//     console.log("Worker said: ", e.data);
//   });
//   const post = (id, ...data) =>
//     worker.postMessage(JSON.stringify({ id, data }));
//   return gunWorker({
//     get: (key) => post("get", key),
//     put: (key, data) => post("put", key, data),
//   });
// };

// useGun()
//   .get("test")
//   .put("MDR");
