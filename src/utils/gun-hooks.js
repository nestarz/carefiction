import { useState, useEffect } from "react";

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
    const listener = node.map().on(register);
    return () => listener.off();
  }, [node]);
  return [
    set,
    (value) => {
      console.log(value);
      console.log(node);
      node.set(value);
    },
  ];
};

export const useGunState = (node, initialState = undefined) => {
  const [value, setValue] = useState(initialState);
  useEffect(() => {
    const listener = node
      .back()
      .get(node._.get)
      .on((value) => setValue(value));
    return () => listener.off();
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