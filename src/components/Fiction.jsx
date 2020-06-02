/* @jsx h */
import { h, Fragment } from "preact";
import { useGunState, useGunSetState } from "../utils/gun-hooks.js";
import { Link } from "wouter-preact";

import { session } from "../App.jsx";

import { ChapterControls, ChapterContent } from "./Chapter.jsx";
import Counter from "./Counter.jsx";

import { useState, useEffect } from "preact/hooks";
import InputText from "./InputText.jsx";

const ChapterLink = ({ fictionKey, node }) => {
  const [titles] = useGunSetState(node.get("titles").get("values"));
  const [count] = useGunState(node.get("interactions").get("count"));

  const { current: title } = titles
    .map(({ data }) => ({ ...data }))
    .reduce((a, b) => (a.count > b.count ? a : b), {});
  // useEffect(() => {
  //   node.back().map().get("titles").get("values").map().on(console.log);
  // }, [titles]);
  return (
    <Link
      to={
        fictionKey
          ? `/fiction/${fictionKey}/chapter/${node._.get}`
          : `/fiction/${node._.get}`
      }
    >
      <span>{title}</span>
      <span>{count}</span>
    </Link>
  );
};

const ChaptersControls = ({ node, type }) => {
  const [chapters, setChapters] = useGunSetState(node.get(type));
  const [lock, setLock] = useGunState(node.get(session).get("lock"));

  const add = (title) =>
    setChapters({ createdAt: new Date().toISOString() })
      .get("titles")
      .get("values")
      .get(session)
      .put({
        createdAt: new Date().toISOString(),
        current: title,
        count: 1,
        lock: false,
      })
      .once(console.log);

  return (
    <>
      {chapters.map(({ node: child }) => (
        <ChapterLink
          fictionKey={type === "chapter" ? node._.get : null}
          node={child}
        />
      ))}
      <input
        readOnly={lock}
        type="text"
        placeholder={`Start a ${type}...`}
        onKeyPress={(e) => {
          if (!lock && e.which == 13) {
            add(e.target.value);
            setLock(true);
            e.preventDefault();
          }
        }}
      />
    </>
  );
};

const Titles = ({ node }) => {
  const [titles] = useGunSetState(node.get("titles").get("values"));
  const { current: title } = titles
    .map(({ data }) => ({ ...data }))
    .reduce((a, b) => (a.count > b.count ? a : b), {});
  useEffect(() => {
    node.back().map().get("titles").get("values").map().on(console.log);
  }, [titles]);
  return (
    <>
      <details>
        <summary>
          <span>></span>
          <InputText placeholder={title} node={node.get("titles")} />
        </summary>
        <div>
          <Counter node={node.get("titles")} />
        </div>
      </details>
    </>
  );
};

export default ({ node, fictionKey, chapterKey }) => {
  const fiction = node.get(fictionKey);
  const chapter = chapterKey
    ? node.get(fictionKey).get("chapters").get(chapterKey)
    : null;
  return (
    <>
      <header>
        <div>
          <Link to="/">Care Fiction</Link>
          <Titles node={fiction} />
          {chapter && <Titles node={chapter} />}
        </div>
      </header>
      <main>
        <div>
          <ChapterContent node={chapter ?? fiction} />
        </div>
      </main>
      <nav>
        <div>
          <span>ADD</span>
          <ChapterControls node={chapter ?? fiction} />
        </div>
      </nav>
      <nav>
        <div>
          <span>{chapter ? "Chapters" : "Fictions"}</span>
          <ChaptersControls
            type={chapter ? "chapter" : "fiction"}
            node={fiction}
          />
        </div>
      </nav>
    </>
  );
};
