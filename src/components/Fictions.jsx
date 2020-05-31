/* @jsx h */
import { h, Fragment } from "preact";
import { Link } from "wouter-preact";

import { useGunState, useGunSetState } from "../utils/gun-hooks.js";
import { byCreateAt, classs } from "../utils/utils.js";

import { Text } from "./Text.jsx";
import { session } from "../App.jsx";

const Image = ({ node }) => {
  const [src] = useGunState(node.get("src"));
  return src ? <img src={src} /> : <></>;
};

export default ({ node, currentKey }) => {
  const [pages, setPages] = useGunSetState(node.get("pages"));
  const [lock, setLock] = useGunState(
    node.get(session).get("pages").get("creation").get("lock")
  );
  const add = () => {
    setPages({ createdAt: new Date().toISOString(), lock: false, session });
    setLock(true);
  };

  return (
    <>
      {pages.sort(byCreateAt).map(({ key, node: fiction, data }) => {
        const [lock] = useGunState(fiction.get("title").get("lock"));
        const [current] = useGunState(fiction.get("title").get("current"));
        const [pageSession] = useGunState(fiction.get("session"));

        if (!lock && pageSession != session) return;
        return (
          <li className={classs({ active: currentKey === key })}>
            {!lock ? (
              <Text
                node={fiction.get("title")}
                placeholder="Name your fiction..."
              />
            ) : (
              <>
                <Image node={fiction.get("image")} />
                <Link href={`/fiction/${key}`}>{current}</Link>
              </>
            )}
          </li>
        );
      })}
      {!lock && (
        <li className="add">
          <a href="#" onClick={add}>
            Add a new fiction
          </a>
        </li>
      )}
    </>
  );
};
