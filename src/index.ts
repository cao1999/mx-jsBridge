window.wakeUp = function () {
  console.log("wakeUp");
};

import jsBridge from "../lib/index";

import Event from "../lib/events";

/* const event = new Event();

event.on("wakeUp", test, "home");

event.on(
  "wakeUp",
  function () {
    console.log(123456);
  },
  "home"
);

function test() {
  console.log(789789);
}

event.on("wakeUp", test);

// event.off("wakeUp", test);

console.log(event, "events");

event.emit("wakeUp", ["all"]); */

const bridge = jsBridge.create({
  nativeApiScope: "Dk",
  log: true,
});

bridge.call("setBackground", {
  img: "",
  color: "",
});

bridge.callAsync("setBackground", function () {
  console.log("I am a async function");
});

function test() {
  console.log(123456789);
}

bridge.Native_on("wakeUp", test);
bridge.Native_on("wakeUp", test);

console.log(bridge);
