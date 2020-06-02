/* @jsx h */
import { h, Fragment } from "preact";

import InputText from "./InputText.jsx";
import Counter from "./Counter.jsx";

export default ({ node }) => {
  return (
    <>
      <InputText placeholder="Write something..." node={node} />
      <Counter node={node} />
    </>
  );
};
