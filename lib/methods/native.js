/**
 * 客户端调用前端
 */

// 前端监听客户端调用前端方法
export function Native_on(type, callback, pageName) {
  this.event.on(type, callback, pageName);
}

// 取消监听客户端
export function Native_off(type, callback, pageName) {
  this.event.off(type, pageName, callback);
}
