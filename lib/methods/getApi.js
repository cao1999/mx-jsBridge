/**
 * 获取所有nativeApi
 * @returns {object | null | undefined}
 */
export function getApi() {
  const { nativeApiScope } = this;

  // copy后返回，不直接返回原对象
  return window?.[nativeApiScope];
}
