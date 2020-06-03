/* @jsx h */
import { h, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";

export default ({ node }) => {
  const [link, setLink] = useState();
  const [name, setName] = useState();
  useEffect(() => {
    node.load(
      (data) => {
        setName(`care-fiction-${new Date().toISOString()}.json`);
        setLink(
          URL.createObjectURL(
            new Blob([JSON.stringify(data)], {
              type: "application/json",
            })
          )
        );
      },
      { wait: 99 }
    );
  }, [node]);
  return (
    <div className="p2p-data-page">
      <a href={link}>Display</a>
      <a href={link} download={name}>
        Download
      </a>
      <span>the database from the peers.</span>
    </div>
  );
};
