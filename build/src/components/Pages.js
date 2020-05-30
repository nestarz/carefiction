import React from "react";
import {Link} from "wouter";
import {useGunSetState} from "./../../../src/utils/gun-hooks.js";
export default ({node}) => {
  const [pages, setPages] = useGunSetState(node.get("pages"));
  const add = () => setPages({
    createdAt: new Date().toISOString(),
    lock: false
  });
  return React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: add
  }, "Add A New Fiction"), pages.sort(byCreateAt).map(({key}) => React.createElement(Link, {
    href: `/fiction/${key}`
  }, React.createElement("a", null, key))));
};
