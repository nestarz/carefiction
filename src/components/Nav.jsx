/* @jsx h */
import { h, Fragment } from "preact";
import { Link } from "wouter-preact";
import { useGunSetState, useGunState } from "../utils/gun-hooks.js";
import { byCreateAt, classs } from "../utils/utils.js";

import { session } from "../App.jsx";
import { Text } from "./Text.jsx";

export default ({ node, currentKey }) => {
  const [chapters, setChapters] = useGunSetState(node.get("chapters"));
  const [lock, setLock] = useGunState(
    node.get(session).get("chapters").get("creation").get("lock")
  );
  const add = () => {
    setChapters({
      createdAt: new Date().toISOString(),
      lock: false,
      session,
    });
    setLock(true);
  };

  return (
    <ol start="0">
      <li>
        <Link href="/">Intro</Link>
      </li>
      {chapters.sort(byCreateAt).map(({ key, node: chapter, data }) => {
        const [lock] = useGunState(chapter.get("subtitle").get("lock"));
        const [current] = useGunState(chapter.get("subtitle").get("current"));

        const [chapterSession] = useGunState(chapter.get("session"));
        if (!lock && chapterSession != session) return;
        return (
          <li className={classs({ active: currentKey === key })}>
            {!lock ? (
              <Text
                node={chapter.get("subtitle")}
                placeholder="Name your chapter..."
              />
            ) : (
              <Link href={`/fiction/${node._.get}/chapter/${key}`}>
                {current}
              </Link>
            )}
          </li>
        );
      })}
      {!lock && (
        <li>
          <a href="#" onClick={add}>
            Add a new chapter
          </a>
        </li>
      )}
    </ol>
  );
};
