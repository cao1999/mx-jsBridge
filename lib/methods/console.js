export function log(message = "", type = "debug") {
  // 是否开启log
  if (!this.debug && type === "debug") return;

  if (type === "debug") {
    console.debug(`%c${message}`, "color: #999");
  } else {
    console.error(message);
  }
}
