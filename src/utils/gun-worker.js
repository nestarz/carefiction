const window = {
  get localStorage() {
    console.log("ok");
  },
  set localStorage(a) {
    console.log("ok")
  }
};  
importScripts("/web_modules/gun/0.2020.520/gun.js");
const gun = window.Gun({ peers: ["http://127.0.0.1:8765/gun"] });

const get = (key) => {
  const slash = key.lastIndexOf("/");
  const node =
    slash !== -1
      ? gun.get(key.substring(0, slash)).get(key.substring(slash + 1))
      : gun.get(key);
  node.on(console.log);
  return node;
};

const actions = {
  get: (key) => get(key),
  put: (key, data) => get(key).put(data),
};

self.addEventListener("message", ({ data: message }) => {
  const { id, data } = JSON.parse(message);
  console.log(id, ...data);
  const result = actions[id](...data);
  // self.postMessage(result);
});


// useEffect(() => {
//   new Function(
//     "window",
//     "with(window){" +
//       `
//   return fetch("/web_modules/gun/0.2020.520/gun.js").then(r => r.text()).then((script) => {
//     eval(script);
//     const gun = window.Gun({ peers: ["http://127.0.0.1:8765/gun"] }).get(100 * 1);
//     return gun;
//   });
//   ` +
//       "}"
//   )({}).then(setRoot);
// }, []);
// console.log(root);