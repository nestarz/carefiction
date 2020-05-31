/* @jsx h */
import { h, Fragment } from "preact";
import { Link } from "wouter-preact";

import { useGunState, useGunSetState } from "../utils/gun-hooks.js";
import { byCreateAt, classs } from "../utils/utils.js";

import { Text } from "./Text.jsx";
import { session } from "../App.jsx";

export default ({ node, currentKey }) => {
  const [pages, setPages] = useGunSetState(node.get("pages"));
  const [lock, setLock] = useGunState(
    node.get(session).get("pages").get("creation").get("lock")
  );
  const add = () => {
    setPages({ createdAt: new Date().toISOString(), lock: false });
    setLock(true);
  };

  return (
    <ol start="0">
      {pages.sort(byCreateAt).map(({ key, node: fiction }) => {
        const [lock] = useGunState(fiction.get("title").get("lock"));
        const [current] = useGunState(fiction.get("title").get("current"));
        return (
          <li className={classs({ active: currentKey === key })}>
            {!lock ? (
              <Text
                node={fiction.get("title")}
                placeholder="Name your fiction..."
              />
            ) : (
              <Link
                href={`/fiction/${key}`}
              >
                {current}
              </Link>
            )}
          </li>
        );
      })}
      {!lock && (
        <li>
          <a href="#" onClick={add}>
            Add a new fiction
          </a>
        </li>
      )}
    </ol>
  );
};
