import { mergeConfig } from "./mergeConfig";
import {
  log,
  isApp,
  getApi,
  callSync,
  callAsync,
  Native_off,
  Native_on,
  hasNativeApi,
} from "../methods";

function JsBridge(config = {}) {
  const initConfig = mergeConfig(config);
  const { nativeApiScope, webApiScope, log } = initConfig;

  this.nativeApiScope = nativeApiScope;
  this.webApiScope = webApiScope;
  this.debug = log;
}

// 前端同步调用客户端
JsBridge.prototype.call = callSync;

// 前端异步调用客户端
JsBridge.prototype.callAsync = callAsync;

// 前端监听客户端的调用 === 客户端调用前端方法
JsBridge.prototype.Native_on = Native_on;

// 取消监听客户端
JsBridge.prototype.Native_off = Native_off;

// 判断某个nativeApi是否存在
JsBridge.prototype.hasNativeApi = hasNativeApi;

// 判断当前是不是native环境
JsBridge.prototype.isApp = isApp;

// 获取所有nativeApi
JsBridge.prototype.getApi = getApi;

// log函数
JsBridge.prototype.log = log;

export default JsBridge;
