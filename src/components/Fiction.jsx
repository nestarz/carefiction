import { useState, useRef } from "preact/hooks";
import { Link } from "wouter-preact";

import { useGunSetState } from "../utils/gun-hooks.js";
import { byCreateAt } from "../utils/utils.js";
import { session } from "../../App.jsx";

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
    .map(({ key, node: child, remove }) => (
      <>
        {/* <span className="hidden" onClick={remove}>
          x
        </span> */}
        <ChapterTitle key={key} parent={parent} node={child} />
      </>
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

const Path = ({ node, type }) => {
  const [titles] = useGunSetState(node.get("titles").get("values"));

  const title = titles
    .map(({ data }) => ({ ...data }))
    .reduce((a, b) => (a.count > b.count ? a : b), {});
  const id = `toggle-${type}`;
  const ref = useRef();
  return (
    <>
      {title.current && (
        <div>
          <input ref={ref} type="checkbox" id={id} class="toggle hidden" />
          <label for={id}>
            <span>{'>'}</span>
            <InputText
              placeholder={title.current}
              node={node.get("titles")}
              onFocus={() => (ref.current.checked = true)}
            />
          </label>
          <div className="vote">
            <Counter node={node.get("titles")} />
          </div>
        </div>
      )}
    </>
  );
};

export default ({ parent, node }) => {
  const main = useRef();
  const scrollDown = () => {
    main.current.scrollTo({
      top: main.current.scrollHeight,
      behavior: "smooth",
    });
  };
  const triggerScrollDown = () => {
    setTimeout(scrollDown);
    setTimeout(scrollDown, 500);
  };
  return (
    <>
      <header>
        <Link to="/">Care Fiction</Link>
        {parent && <Path node={parent} type="fiction" />}
        <Path node={node} type="chapter" />
      </header>
      <main ref={main}>
        <BlocksContent node={node} />
      </main>
      {parent && <aside>
        <input type="checkbox" id="toggle-add" class="toggle hidden" />
        <label for="toggle-add">Add</label>
        <div className="details">
          <BlocksProducer node={node} onUpdate={triggerScrollDown} />
        </div>
      </aside>}
      <nav>
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
      </nav>
    </>
  );
};
