/* @jsx h */
import { h, Fragment } from "preact";
import { useState, useRef } from "preact/hooks";
import { Link } from "wouter-preact";

import { useGunSetState } from "../utils/gun-hooks.js";
import { byCreateAt } from "../utils/utils.js";
import { session } from "../App.jsx";

import { BlocksContent, BlocksProducer } from "./Blocks.jsx";
import Counter from "./Counter.jsx";
import InputText from "./InputText.jsx";

const ChapterTitle = ({ parent, node }) => {
  const [titles] = useGunSetState(node.get("titles").get("values"));

  const title = titles
    .map(({ data }) => ({ ...data }))
    .reduce((a, b) => (a.count > b.count ? a : b), {});

  return (
    title.current && (
      <Link
        to={
          parent
            ? `/fiction/${parent._.get}/chapter/${node._.get}/`
            : `/fiction/${node._.get}/`
        }
      >
        <span>{title && title.current}</span>
        <span className="count">{title && title.count}</span>
      </Link>
    )
  );
};

const ListChapters = ({ node, parent }) => {
  const [chapters] = useGunSetState(node.get("chapters"));

  return chapters
    .sort(byCreateAt)
    .reverse()
    .map(({ key, node: child }) => (
      <ChapterTitle key={key} parent={parent} node={child} />
    ));
};

const CreateChapter = ({ parent, node }) => {
  const [_, setChapters] = useGunSetState(node.get("chapters"));
  const [lock, setLock] = useState(false);
  const add = (title) => {
    const createdAt = new Date().toISOString();
    const chapter = setChapters({ createdAt });

    chapter
      .get("chapters")
      .get("Intro")
      .put({ createdAt })
      .get("titles")
      .get("values")
      .get(session)
      .put({ createdAt, current: "Intro", count: 1 });

    chapter
      .get("titles")
      .get("values")
      .get(session)
      .put({ createdAt, current: title, count: 1 });
  };
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

  const ref = useRef();
  return (
    <>
      {title.current && (
        <details ref={ref}>
          <summary>
            <span>></span>
            <InputText
              placeholder={title.current}
              node={node.get("titles")}
              onFocus={() => (ref.current.open = true)}
            />
          </summary>
          <div>
            <Counter node={node.get("titles")} />
          </div>
        </details>
      )}
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
          <input type="checkbox" id="toggle-add" class="toggle hidden" />
          <label for="toggle-add">Add</label>
          <div className="details">
            <BlocksProducer node={node} />
          </div>
        </div>
      </nav>
      <nav>
        <div>
          <input type="checkbox" id="toggle-list" class="toggle hidden" />
          {parent ? (
            <>
              <label for="toggle-list">Chapters</label>
              <div className="details">
                <ListChapters parent={parent} node={parent} />
                <CreateChapter parent={parent} node={parent} />
              </div>
            </>
          ) : (
            <>
              <label for="toggle-list">Fictions</label>
              <div className="details">
                <ListChapters node={node} />
                <CreateChapter node={node} />
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};
