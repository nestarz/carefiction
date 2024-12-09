import "gun";
import "gun/lib/radix.js";
import "gun/lib/radisk.js";
import "gun/lib/store.js";
import "gun/lib/rindexed.js";
import "gun/lib/open.js";
import "gun/lib/load.js";

import { useEffect, useState } from "preact/hooks";
import urlbat from "urlbat";
import { encodeHex } from "@std/encoding/hex";

const opt = {
  store: {
    get: function (key, done) {
      fetch(
        urlbat(
          "https://carefiction.assets.elias.systems/gun/care-fiction-1/:key",
          { key: `${encodeHex(key)}.json` },
        ),
      )
        .then((r) => r.status === 200 ? r.text() : Promise.reject())
        .then((node) => done(undefined, node))
        .catch(() => done());
    },
    put: function (key, node, done) {
      fetch(urlbat("/gun", { key: `${encodeHex(key)}.json` }), {
        method: "PUT",
      })
        .then((r) => r.text())
        .then((url) =>
          fetch(url, {
            method: "PUT",
            body: new File(
              [new Blob([node], { type: "application/json" })],
              `${encodeHex(key)}.json`,
            ),
          })
        )
        .then(() => done())
        .catch((err) => done(err));
    },
  },
};

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

export const useGun = ({ root }) => {
  const gun = new Gun({ ...opt, localStorage: false });
  console.log(gun);
  return gun.get(root);
};
