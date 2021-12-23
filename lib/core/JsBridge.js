import { mergeConfig } from "./mergeConfig";
import { callSync, callAsync, Native_off, Native_on } from "../methods";

function JsBridge(config = {}) {
  const initConfig = mergeConfig(config);
  const { nativeApiScope, webApiScope, log } = initConfig;

  this.nativeApiScope = nativeApiScope;
  this.webApiScope = webApiScope;
  this.log = log;
}

// 前端同步调用客户端
JsBridge.prototype.call = callSync;

// 前端异步调用客户端
JsBridge.prototype.callAsync = callAsync;

// 前端监听客户端的调用 === 客户端调用前端方法
JsBridge.prototype.Native_on = Native_on;

// 取消监听客户端
JsBridge.prototype.Native_off = Native_off;

export default JsBridge;
