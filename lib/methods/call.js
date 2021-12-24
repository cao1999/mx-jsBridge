import { stringifyDebugLog } from "../utils";

/**
 * 前端同步调用客户端
 * @param {*} ApiName 客户端方法名
 * @param  {...any} args 客户端方法参数
 */
export function callSync(apiName, ...args) {
  // 打log
  this.log(`Call Native: ${stringifyDebugLog(arguments)}`);

  // 判断当前环境，api是否存在
  if (!this.hasNativeApi(apiName) || !this.isApp()) {
    this.log(`NativeApi ${apiName} do not exist`, "error");
    return { devEnv: true };
  }

  // 获取所有客户端方法
  const nativeApi = this.getApi();

  // 调用客户端方法，有必要使用try catch
  try {
    return nativeApi[apiName].apply(nativeApi, args);
  } catch (e) {
    this.log(
      `Call native method ${apiName} with arguments [${args}] error \n ${e.message}`,
      "error"
    );
  }
}
