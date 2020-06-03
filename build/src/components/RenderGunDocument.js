import {h, Fragment} from "preact";
import {useEffect, useState} from "preact/hooks";
export default ({node}) => {
  const [link, setLink] = useState();
  const [name, setName] = useState();
  useEffect(() => {
    node.load((data) => {
      setName(`care-fiction-${new Date().toISOString()}.json`);
      setLink(URL.createObjectURL(new Blob([JSON.stringify(data)], {
        type: "application/json"
      })));
    }, {
      wait: 99
    });
  }, [node]);
  return h("div", {
    className: "p2p-data-page"
  }, h("a", {
    href: link
  }, "Display"), h("a", {
    href: link,
    download: name
  }, "Download"), h("span", null, "the database from the peers."));
};
