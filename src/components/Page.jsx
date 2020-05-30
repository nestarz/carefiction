/* @jsx h */
import { h, Fragment } from "preact";
import { Link } from "wouter-preact";

import { useGunState } from "../utils/gun-hooks.js";
import { formatDate } from "../utils/utils.js";

import Paragraphs from "./Paragraphs.jsx";
import { Text } from "./Text.jsx";
import Image from "./Image.jsx";

export default ({ id, node }) => {
  const [createdAt] = useGunState(node.get("createdAt"));
  return (
    <>
      <h1>
        <span>Care Fiction:</span>
        <Text node={node.get("title")} placeholder={"Enter A Title"} />
      </h1>
      <ol start="0">
        <li>
          <Link href="/about/">Intro</Link>
        </li>
        <li className="active">
          <a href="#">First visit</a>
        </li>
        <li>
          <Link href={`/context/${id}`}>Context</Link>
        </li>
      </ol>
      <Image maxSizeKo={300} node={node.get("image")} />
      <h2>
        <Text node={node.get("subtitle")} placeholder={"Enter A Subtitle"} />
      </h2>
      <time datetime={createdAt}>{formatDate(createdAt)}</time>
      <Paragraphs node={node} />
    </>
  );
};
