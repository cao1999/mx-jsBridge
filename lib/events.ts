/**
 * 订阅-发布模式
 * 函数队列
 */

import { isType } from "./utils";

interface EventProps {
  [prop: string]: {
    [prop: string]: Array<(...args: any[]) => void>;
  };
}

class EventEmitter {
  events: EventProps;
  constructor() {
    this.events = {};
  }

  /**
   * 监听事件
   * @param {string} type 事件类型
   * @param {*} callback 事件回调
   * @param {string} pageType 页面类型
   * 1. 加上pageType参数可以指定执行那个页面的callback，减少执行无用函数，提升效率
   */
  on(type: string, callback: () => void, pageType: string = "default") {
    if (pageType === "all") {
      return console.error(
        "监听事件时pageType不能为all，触发事件和卸载事件时可以"
      );
    }

    if (!type || !callback) return;

    pageType = pageType || "default";

    const cbList = this.events[type];

    if (cbList && cbList[pageType]) {
      this.events[type][pageType].push(callback);
    } else {
      this.events[type] = {
        ...cbList,
        [pageType]: [callback],
      };
    }
  }

  /**
   * 触发事件
   * @param {*} type 事件类型
   * @param {string | string[]} pageType 页面类型
   * @param  {...any} args callback参数
   */
  emit(type: string, pageType: string | string[] = "default", ...args: any[]) {
    const cbList = this.events[type];

    pageType = pageType || "default";

    if (cbList) {
      if (
        pageType === "all" ||
        (isType(pageType, "array") && pageType.includes("all"))
      ) {
        for (let pageCb in cbList) {
          cbList[pageCb].forEach((cb) => {
            cb.apply(null, args);
          });
        }
      } else {
        if (isType(pageType, "array")) {
          (pageType as []).forEach((pageCbItem) => {
            for (let pageCb in cbList) {
              if (pageCb === pageCbItem) {
                cbList[pageCb].forEach((cb) => {
                  cb.apply(null, args);
                });

                break;
              }
            }
          });
        } else {
          this.events[type][pageType as string].forEach((cb) => {
            cb.apply(null, args);
          });
        }
      }
    } else {
      return console.error(`Event type ${type} doesn't exist`);
    }
  }

  /**
   * 卸载事件
   * @param {*} type 需要卸载的事件类型
   * @param {*} callback 需要卸载的回调，这里的回调函数必须和注册时的回调函数相等，类似addEventListener
   * @param {*} pageType 页面类型
   */
  off(type: string, pageType: string = "default", callback: () => void) {
    const cbList = this.events[type];

    if (cbList && (cbList[pageType] || pageType === "all")) {
      // callback不存在或者pageType===all，删除所有页面的type事件
      if (pageType === "all" || !callback) {
        this.events[type] = {};
      } else {
        this.events[type][pageType] = cbList[pageType].filter(
          (cb) => cb !== callback
        );
      }
    }
  }
}

export default EventEmitter;
