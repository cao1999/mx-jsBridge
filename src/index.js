window.wakeUp = function () {
  console.log("wakeUp");
};

import jsBridge from "../lib";

const bridge = jsBridge.create({
  nativeApiScope: "Dk",
  log: true,
});

bridge.call("setBackground", {
  img: "",
  color: "",
});

// bridge.callAsync();

// bridge.Native_on();

// bridge.Native_off();

console.log(bridge);
