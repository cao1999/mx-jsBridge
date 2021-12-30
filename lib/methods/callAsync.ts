import { isType } from "../utils";

interface ParamsProp {
  [prop: string]: any;
}

/**
 * 前端异步调用客户端
 * @param {string} apiName 客户端方法名
 * @param {object} params 传给客户端方法的参数
 * @param {function} callback 回调函数
 * @param {function} error error函数
 */
export function callAsync(
  apiName: string,
  params: ParamsProp,
  callback: () => any,
  error: () => any
) {
  // 打log
  this.log(`Call Async Native: ${JSON.stringify(arguments)}`);

  // 如果第二个参数是函数，表示没传参数
  if (isType(params, "function")) {
    callback = params;
    params = {};
  }

  // 判断当前环境是否为app
  if (!this.isApp()) {
    this.log(`Browser env can't call native api`, "error");
    return { devEnv: true };
  }

  // 判断客户端api是否存在
  if (!this.hasNativeApi(apiName)) {
    this.log(`NativeApi ${apiName} do not exist`, "error");
    return { devEnv: true };
  }

  // 定义callback的id
  const _callbackId_ = `${apiName}_callbackId_${new Date(
    Date.now()
  ).getTime()}`;

  console.log(_callbackId_, "callback_id");

  // 保存callback对应的id
  this.callbackMap.set(_callbackId_, callback);

  const asyncNativeApi = this.getApi();

  params[_callbackId_] = _callbackId_;

  try {
    return asyncNativeApi[apiName].apply(asyncNativeApi, [params]);
  } catch (e) {
    this.log(
      `Call async native method ${apiName} with arguments [${params}] error \n ${e.message}`,
      "error"
    );
  }
}

interface MessageProp {
  [prop: string]: any;
}

/**
 * 客户端将callback的参数和id回传
 * @param {*} callbackId
 * @param  {...any} args
 */
export function handleMessage(message: MessageProp = {}) {
  // 消息类型callback or event
  const messageType = message.type;
  const args = message.args || [];

  // 异步调用的回调
  if (messageType === "callback") {
    const callbackId = message.callbackId;

    // 根据回传的callbackId取出对应的callback
    const callback = this.callbackMap.get(callbackId);

    // 执行callback
    callback && callback(args);
  } else if (messageType === "event") {
    // 执行客户端事件回调
    const eventName = message.eventName;
    const pageName = message.pageName;

    this.event.emit(eventName, pageName, ...args);
  }
}
