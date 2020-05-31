/* @jsx h */
import { h, Fragment } from "preact";
import { Link } from "wouter-preact";

import { useGunState } from "../utils/gun-hooks.js";
import { formatDate, classs } from "../utils/utils.js";

import Plan from "./Plan.jsx";
import Paragraphs from "./Paragraphs.jsx";
import { Text } from "./Text.jsx";
import Image from "./Image.jsx";
import Nav from "./Nav.jsx";

export default ({ fiction, chapter }) => {
  const [createdAt] = useGunState(chapter.get("createdAt"));
  const [type, setType] = useGunState(chapter.get("type").get("current"));
  const [typeLock, setTypeLock] = useGunState(chapter.get("type").get("lock"));
  return (
    <div className={classs("chapter", type)}>
      <h1>
        <Link to={`/fiction/${fiction._.get}`}>
          <span>Care Fiction:</span>
          <Text node={fiction.get("title")} placeholder={"Enter A Title"} />
        </Link>
      </h1>
      <Nav node={fiction} />
      {type === "paragraphs" && typeLock ? (
        <>
          <Image maxSizeKo={300} node={chapter.get("image")} />
          <h2>
            <Text
              node={chapter.get("subtitle")}
              placeholder={"Enter A Subtitle"}
            />
          </h2>
          <time datetime={createdAt}>{formatDate(createdAt)}</time>

          <Paragraphs node={chapter} />
        </>
      ) : type === "plan" && typeLock ? (
        <Plan node={chapter.get("plan")} />
      ) : (
        <div className="question">
          <label>This new chapter is</label>
          <input
            onClick={() => setType("plan")}
            type="radio"
            checked={type == "plan"}
            name="type"
          />
          <label onClick={() => setType("plan")}>a Plan</label>
          <input
            onClick={() => setType("paragraphs")}
            checked={type == "paragraphs"}
            type="radio"
            name="type"
          />
          <label onClick={() => setType("paragraphs")}>a Fill Gap</label>
          <button disabled={!type} onClick={() => setTypeLock(true)}>
            Lock
          </button>
        </div>
      )}
    </div>
  );
};
