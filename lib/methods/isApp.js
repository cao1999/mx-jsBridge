import { isType } from "../utils";

/**
 * 判断当前是不是native环境
 * 1. 判断window中是否存在客户端注入的对象
 * 2. 存在则是native，不存在则是browser
 * @returns {boolean}
 */
export function isApp() {
  const api = this.getApi();

  return api && isType(api, "object");
}
