/* @jsx h */
import { h, Fragment } from "preact";
import { Link } from "wouter-preact";

import { useGunSetState } from "../utils/gun-hooks.js";
import { byCreateAt } from "../utils/utils.js";

export default ({ node }) => {
  const [pages, setPages] = useGunSetState(node.get("pages"));
  const add = () =>
    setPages({ createdAt: new Date().toISOString(), lock: false });

  return (
    <>
      <button onClick={add}>Add A New Fiction</button>
      {pages.sort(byCreateAt).map(({ key }) => (
        <Link href={`/fiction/${key}`}>
          <a>{key}</a>
        </Link>
      ))}
    </>
  );
};
