/* @jsx h */
import { h, Fragment } from "preact";
import { Link } from "wouter-preact";

import { useGunState } from "../utils/gun-hooks.js";
import { formatDate } from "../utils/utils.js";

import { Text } from "./Text.jsx";
import Image from "./Image.jsx";
import Nav from "./Nav.jsx";

export default ({ node }) => {
  const [createdAt] = useGunState(node.get("createdAt"));
  return (
    <div className="fiction">
      <h1>
        <span>Care Fiction:</span>
        <Text node={node.get("title")} placeholder={"Enter A Title"} />
      </h1>
      <Nav node={node} currentKey={node._.get} />
      <Image maxSizeKo={400} node={node.get("image")} />
      <h2>
        <Text node={node.get("subtitle")} placeholder={"Enter A Subtitle"} />
      </h2>
      {/* <time datetime={createdAt}>{formatDate(createdAt)}</time> */}
    </div>
  );
};
