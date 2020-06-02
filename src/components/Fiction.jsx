/* @jsx h */
import { h, Fragment } from "preact";
import { useState } from "preact/hooks";
import { Link } from "wouter-preact";

import { useGunSetState } from "../utils/gun-hooks.js";
import { session } from "../App.jsx";

import { BlocksContent, BlocksProducer } from "./Blocks.jsx";
import Counter from "./Counter.jsx";
import InputText from "./InputText.jsx";

const ChapterTitle = ({ parent, node }) => {
  const [titles] = useGunSetState(node.get("titles").get("values"));

  const title = titles
    .map(({ data }) => ({ ...data }))
    .reduce((a, b) => (console.log(a) || a.count > b.count ? a : b), {});

  return (
    <Link
      to={
        parent
          ? `/fiction/${parent._.get}/chapter/${node._.get}/`
          : `/fiction/${node._.get}/`
      }
    >
      <span>{title && title.current}</span>
      <span>{title && title.count}</span>
    </Link>
  );
};

const ListChapters = ({ node, parent }) => {
  const [chapters] = useGunSetState(node.get("chapters"));

  return chapters.map(({ key, node: child }) => (
    <ChapterTitle key={key} parent={parent} node={child} />
  ));
};

const CreateChapter = ({ parent, node }) => {
  const [_, setChapters] = useGunSetState(node.get("chapters"));
  const [lock, setLock] = useState(false);
  const add = (title) =>
    setChapters({
      createdAt: new Date().toISOString(),
    })
      .get("titles")
      .get("values")
      .get(session)
      .put({ current: title, count: 1 });

  return (
    <input
      readOnly={lock}
      type="text"
      placeholder={parent ? `Start a Chapter...` : `Start a Fiction...`}
      onKeyPress={(e) => {
        if (!lock && e.which == 13) {
          add(e.target.value);
          setLock(true);
          e.preventDefault();
        }
      }}
    />
  );
};

const Path = ({ node }) => {
  const [titles] = useGunSetState(node.get("titles").get("values"));

  const title = titles
    .map(({ data }) => ({ ...data }))
    .reduce((a, b) => (a.count > b.count ? a : b), {});

  return (
    <>
      <details>
        <summary>
          <span>></span>
          <InputText placeholder={title.current} node={node.get("titles")} />
        </summary>
        <div>
          <Counter node={node.get("titles")} />
        </div>
      </details>
    </>
  );
};

export default ({ parent, node }) => {
  return (
    <>
      <header>
        <div>
          <Link to="/">Care Fiction</Link>
          {parent && <Path node={parent} />}
          <Path node={node} />
        </div>
      </header>
      <main>
        <div>
          <BlocksContent node={node} />
        </div>
      </main>
      <nav>
        <div>
          <span>ADD</span>
          <BlocksProducer node={node} />
        </div>
      </nav>
      <nav>
        <div>
          {parent ? (
            <>
              <span>Chapters</span>
              <ListChapters parent={parent} node={parent} />
              <CreateChapter parent={parent} node={parent} />
            </>
          ) : (
            <>
              <span>Fictions</span>
              <ListChapters node={node} />
              <CreateChapter node={node} />
            </>
          )}
        </div>
      </nav>
    </>
  );
};
