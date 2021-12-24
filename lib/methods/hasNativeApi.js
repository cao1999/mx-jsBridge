/**
 * 判断某个nativeApi是否存在
 * @param {*} apiName 函数名
 * 1. 判断客户端是否注入这个方法，即判断nativeApi对象中是否有这个方法
 */
export function hasNativeApi(apiName) {
  const { nativeApiScope } = this;

  return !!window?.[nativeApiScope]?.[apiName];
}
