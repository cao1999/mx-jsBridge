export function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

export function isType(value, expectType) {
  return getType(value) === expectType.toLowerCase();
}

export function stringifyDebugLog(obj, privateData) {
  return JSON.stringify(obj);
}
