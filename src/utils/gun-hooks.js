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
      event && event.off();
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
      event && event.off();
      setValue(initialState);
    };
  }, [node]);
  return [value, (value) => node.put(value)];
};

export const useGun = ({ peers, root }) => {
  const gun = window.Gun({ peers, localStorage: false }).get(root);
  // gun.open(console.log); to screenshot the database;
  return gun;
};