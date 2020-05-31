/* @jsx h */
import { h, Fragment } from "preact";
import { Link } from "wouter-preact";

import { useGunState } from "../utils/gun-hooks.js";
import { formatDate } from "../utils/utils.js";

import Paragraphs from "./Paragraphs.jsx";
import { Text } from "./Text.jsx";
import Image from "./Image.jsx";
import Nav from "./Nav.jsx";

export default ({ fiction, chapter }) => {
  const [createdAt] = useGunState(chapter.get("createdAt"));
  return (
    <div className="chapter">
      <h1>
        <Link to={`/fiction/${fiction._.get}`}>
          <span>Care Fiction:</span>
          <Text node={fiction.get("title")} placeholder={"Enter A Title"} />
        </Link>
      </h1>
      <Nav node={fiction} currentKey={chapter._.get} />
      <Image maxSizeKo={400} node={chapter.get("image")} />
      <h2>
        <Text node={chapter.get("subtitle")} placeholder={"Enter A Subtitle"} />
      </h2>
      <time datetime={createdAt}>{formatDate(createdAt)}</time>

      <Paragraphs node={chapter} />
    </div>
  );
};
