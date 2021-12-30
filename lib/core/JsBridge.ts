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
  handleMessage,
} from "../methods";
import EventEmitter from "../events";

function JsBridge(config = {}) {
  const initConfig = mergeConfig(config);
  const { nativeApiScope, webApiScope, log } = initConfig;

  // 注入客户端方法的对象名
  this.nativeApiScope = nativeApiScope;
  // 注入前端方法的对象名
  this.webApiScope = webApiScope;
  // 是否开启debug log
  this.debug = log;
  // 存放异步方法的callback
  this.callbackMap = new Map();
  // 存放客户端事件
  this.event = new EventEmitter();

  const init = () => {
    (window as any)[webApiScope] = {};

    window[webApiScope].handleMessage = this.handleMessage.bind(this);
  };

  init();
}

// 前端同步调用客户端
JsBridge.prototype.call = callSync;

// 前端异步调用客户端
JsBridge.prototype.callAsync = callAsync;

// 处理客户端返回callback参数和id
JsBridge.prototype.handleMessage = handleMessage;

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
