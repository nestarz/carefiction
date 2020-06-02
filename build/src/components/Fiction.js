import {h, Fragment} from "preact";
import {useState} from "preact/hooks";
import {Link} from "wouter-preact";
import {useGunSetState} from "./../../../src/utils/gun-hooks.js";
import {byCreateAt} from "./../../../src/utils/utils.js";
import {session} from "./../../../src/App.jsx";
import {BlocksContent, BlocksProducer} from "./../../../src/components/Blocks.jsx";
import Counter2 from "./../../../src/components/Counter.jsx";
import InputText2 from "./../../../src/components/InputText.jsx";
const ChapterTitle = ({parent, node}) => {
  const [titles] = useGunSetState(node.get("titles").get("values"));
  const title = titles.map(({data}) => ({
    ...data
  })).reduce((a, b) => console.log(a) || a.count > b.count ? a : b, {});
  return h(Link, {
    to: parent ? `/fiction/${parent._.get}/chapter/${node._.get}/` : `/fiction/${node._.get}/`
  }, h("span", null, title && title.current), h("span", {
    className: "count"
  }, title && title.count));
};
const ListChapters = ({node, parent}) => {
  const [chapters] = useGunSetState(node.get("chapters"));
  return chapters.sort(byCreateAt).map(({key, node: child}) => h(ChapterTitle, {
    key,
    parent,
    node: child
  }));
};
const CreateChapter = ({parent, node}) => {
  const [_, setChapters] = useGunSetState(node.get("chapters"));
  const [lock, setLock] = useState(false);
  const add = (title) => {
    const createdAt = new Date().toISOString();
    const chapter = setChapters({
      createdAt
    });
    chapter.get("chapters").get("Intro").put({
      createdAt
    }).get("titles").get("values").get(session).put({
      createdAt,
      current: "Intro",
      count: 1
    });
    chapter.get("titles").get("values").get(session).put({
      createdAt,
      current: title,
      count: 1
    });
  };
  return h("input", {
    readOnly: lock,
    type: "text",
    placeholder: parent ? `Start a Chapter...` : `Start a Fiction...`,
    onKeyPress: (e) => {
      if (!lock && e.which == 13) {
        add(e.target.value);
        setLock(true);
        e.preventDefault();
      }
    }
  });
};
const Path = ({node}) => {
  const [titles] = useGunSetState(node.get("titles").get("values"));
  const title = titles.map(({data}) => ({
    ...data
  })).reduce((a, b) => a.count > b.count ? a : b, {});
  return h(Fragment, null, title.current && h("details", null, h("summary", null, h("span", null, ">"), h(InputText2, {
    placeholder: title.current,
    node: node.get("titles")
  })), h("div", null, h(Counter2, {
    node: node.get("titles")
  }))));
};
export default ({parent, node}) => {
  console.log(parent);
  return h(Fragment, null, h("header", null, h("div", null, h(Link, {
    to: "/"
  }, "Care Fiction"), parent && h(Path, {
    node: parent
  }), h(Path, {
    node
  }))), h("main", null, h("div", null, h(BlocksContent, {
    node
  }))), h("nav", null, h("div", null, h("span", null, "ADD"), h(BlocksProducer, {
    node
  }))), h("nav", null, h("div", null, parent ? h(Fragment, null, h("span", null, "Chapters"), h(ListChapters, {
    parent,
    node: parent
  }), h(CreateChapter, {
    parent,
    node: parent
  })) : h(Fragment, null, h("span", null, "Fictions"), h(ListChapters, {
    node
  }), h(CreateChapter, {
    node
  })))));
};
