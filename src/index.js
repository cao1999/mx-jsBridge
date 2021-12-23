window.wakeUp = function () {
  console.log("wakeUp");
};

import jsBridge from "../lib";

jsBridge.call();

jsBridge.callAsync();

jsBridge.create();

jsBridge.Native_on();

jsBridge.Native_off();

console.log(jsBridge);
