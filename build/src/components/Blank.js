import {h, Fragment} from "preact";
import InputText2 from "./../../../src/components/InputText.jsx";
import Counter2 from "./../../../src/components/Counter.jsx";
export default ({node}) => {
  return h(Fragment, null, h(InputText2, {
    placeholder: "Write something...",
    node
  }), h(Counter2, {
    node
  }));
};
