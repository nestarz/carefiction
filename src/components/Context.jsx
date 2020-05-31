/* @jsx h */
import { h, Fragment } from "preact";
import { useState } from "preact/hooks";
import { Link } from "wouter-preact";

import { useGunSetState, useGunState } from "../utils/gun-hooks.js";

import Nav from "./Nav.jsx";
import Video from "./Video.jsx";
import Image from "./Image.jsx";
import { Text, Sentence } from "./Text.jsx";

const ContextParagraph = ({ node, remove }) => {
  const [lock, setLock] = useGunState(node.get("lock"), true);
  const [withImage, setWithImage] = useGunState(node.get("withImage"), false);
  const [withVideo, setWithVideo] = useGunState(node.get("withVideo"), false);
  const [valid, setValid] = useState(false);

  return (
    <>
      <p className="context">
        <Sentence node={node} onValid={setValid} lock={lock} />
      </p>
      {!lock && (
        <>
          <button disabled={!valid} onClick={() => setLock(true)}>
            Lock The Paragraph
          </button>
          <button onClick={remove}>Remove The Paragraph</button>
          {!withVideo && (
            <button onClick={() => setWithImage(!withImage)}>
              {withImage ? "Remove" : "Add"} Image
            </button>
          )}
          {!withImage && (
            <button onClick={() => setWithVideo(!withVideo)}>
              {withVideo ? "Remove" : "Add"} Video
            </button>
          )}
        </>
      )}
      {withVideo && <Video node={node.get("video")} />}
      {withImage && <Image maxSizeKo={500} node={node.get("image")} />}
    </>
  );
};

const ContextParagraphs = ({ node }) => {
  const [texts, setTexts] = useGunSetState(node.get("texts"));
  const add = () =>
    setTexts({
      createdAt: new Date().toISOString(),
      placeholder: "Write a text",
      lock: false,
    });
  return (
    <>
      {texts.map(({ ...props }) => (
        <ContextParagraph {...props} />
      ))}
      <button onClick={add}>Add A New Paragraph</button>
    </>
  );
};

export default ({ fiction, chapter }) => {
  return (
    <>
      <h1>
        <span>Care Fiction:</span>
        <Text node={fiction.get("title")} placeholder={"Enter A Title"} />
      </h1>
      <Nav node={fiction} />
      <Image maxSizeKo={300} node={fiction.get("image")} />
      <h2>CO-WRITE THE STORY!</h2>
      <ContextParagraphs node={chapter} />
    </>
  );
};
