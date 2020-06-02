import {h, Fragment} from "preact";
import {useGunState, useGunSetState} from "./../../../src/utils/gun-hooks.js";
import {Link} from "wouter-preact";
import {session} from "./../../../src/App.jsx";
import {ChapterControls, ChapterContent} from "./../../../src/components/Chapter.jsx";
import Counter2 from "./../../../src/components/Counter.jsx";
import {useState, useEffect} from "preact/hooks";
import InputText2 from "./../../../src/components/InputText.jsx";
const ChapterLink = ({fictionKey, node}) => {
  const [titles] = useGunSetState(node.get("titles").get("values"));
  const [count] = useGunState(node.get("interactions").get("count"));
  const {current: title} = titles.map(({data}) => ({
    ...data
  })).reduce((a, b) => a.count > b.count ? a : b, {});
  return h(Link, {
    to: fictionKey ? `/fiction/${fictionKey}/chapter/${node._.get}` : `/fiction/${node._.get}`
  }, h("span", null, title), h("span", null, count));
};
const ChaptersControls = ({node, type}) => {
  const [chapters, setChapters] = useGunSetState(node.get(type));
  const [lock, setLock] = useGunState(node.get(session).get("lock"));
  const add = (title) => setChapters({
    createdAt: new Date().toISOString()
  }).get("titles").get("values").get(session).put({
    createdAt: new Date().toISOString(),
    current: title,
    count: 1,
    lock: false
  }).once(console.log);
  return h(Fragment, null, chapters.map(({node: child}) => h(ChapterLink, {
    fictionKey: type === "chapter" ? node._.get : null,
    node: child
  })), h("input", {
    readOnly: lock,
    type: "text",
    placeholder: `Start a ${type}...`,
    onKeyPress: (e) => {
      if (!lock && e.which == 13) {
        add(e.target.value);
        setLock(true);
        e.preventDefault();
      }
    }
  }));
};
const Titles = ({node}) => {
  const [titles] = useGunSetState(node.get("titles").get("values"));
  const {current: title} = titles.map(({data}) => ({
    ...data
  })).reduce((a, b) => a.count > b.count ? a : b, {});
  useEffect(() => {
    node.back().map().get("titles").get("values").map().on(console.log);
  }, [titles]);
  return h(Fragment, null, h("details", null, h("summary", null, h("span", null, ">"), h(InputText2, {
    placeholder: title,
    node: node.get("titles")
  })), h("div", null, h(Counter2, {
    node: node.get("titles")
  }))));
};
export default ({node, fictionKey, chapterKey}) => {
  const fiction = node.get(fictionKey);
  const chapter = chapterKey ? node.get(fictionKey).get("chapters").get(chapterKey) : null;
  return h(Fragment, null, h("header", null, h("div", null, h(Link, {
    to: "/"
  }, "Care Fiction"), h(Titles, {
    node: fiction
  }), chapter && h(Titles, {
    node: chapter
  }))), h("main", null, h("div", null, h(ChapterContent, {
    node: chapter ?? fiction
  }))), h("nav", null, h("div", null, h("span", null, "ADD"), h(ChapterControls, {
    node: chapter ?? fiction
  }))), h("nav", null, h("div", null, h("span", null, chapter ? "Chapters" : "Fictions"), h(ChaptersControls, {
    type: chapter ? "chapter" : "fiction",
    node: fiction
  }))));
};
