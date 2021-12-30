## 封装

### 功能

**主要功能**

1. 前端**同步调用**客户端方法
2. 前端**异步调用**客户端方法，需要传`callback`
3. 客户端**同步调用**前端方法，**对前端来说相当于事件**

**辅助功能**

1. 判断当前环境是**浏览器**还是**App**，浏览器环境无**App**方法。不能通过`userAgent`进行判断，浏览器自带的手机模拟器的`userAgent`值也是`native`。判断前端是否**存在客户端注入的方法**是可行的
2. 是否开启 **debug**模式，会在控制台打印**调用客户端方法**的细节
3. 判断客户端是否**存在**某个方法
4. 实现`EventEmitter`用来**管理事件**

### 实现

#### 前端同步调用客户端

最简单的方式就是客户端把方法`fn`注册到`window`对象，然后前端直接`window.fn()`去触发。

以上方法会存在一些问题

1. **污染全局变量**，如果想在`window`对象上添加**同名函数**，会**覆盖**客户端方法
2. 不好进行管理

比较好的方法是将**客户端注入的方法**统一放到`window`对象的**属性中**，例如`window.nativeApi = {}`,

前端调用客户端某个方法`window.nativeApi.foo()`

#### 前端异步调用客户端

**异步调用**其实是由**两次单向(前端先调用客户端，然后客户端在调用前端)**调用组成

前端是无法直接将**异步回调**当作**参数**传给客户端并让其执行的，**异步回调**只能在前端执行

目前可行的做法是在**前端**创建一个`map`**用来存储前端的`callback`**，`key`为`callbackId`，`value`为`callback`。前端调用客户端方法时将`callbackId`作为参数传过去，当客户端方法执行结束后需要执行前端回调时，调用前端的指定方法`handleMessage`，将这个`callbackId`和`callback 参数`传回前端。前端在根据`callbackId`去`map`中找到指定的`callback`，执行并将参数传给这个`callback`，这样就实现了**异步调用客户端方法了**

#### 客户端同步调用前端

基本原理就是前端将方法**注入到`window`或者`window`对象下的属性中**，客户端在去调用这个方法。

基于**上述原理**可以有以下**两种方式**实现**客户端调用前端方法**

**第一种**就是上述原理所述方法，但是这种方法会有**弊端**。**相同方法名**的函数只能**注册一次**，多次注册后者会**覆盖**前者，但是在开发中经常会遇到需要**多次注册相同函数**的需求。例如`wakeUp`事件，在页面**唤醒**后执行前端函数，往往**很多页面**都会注册`wakeUp`事件，这时就需要有多个`wakeUp`函数。第二种方法可以满足这种需求

```javascript
// 在a页面注册wakeUp函数
window.wakeUp = function () {
  console.log("a页面");
};

// 在b页面注册wakeUp事件
window.wakeUp = function () {
  console.log("b页面");
};

// 这时b页面的wakeUp函数必然会覆盖a页面的wakeUp函数
// 可能会导致a页面出现不可预测的问题
```

**第二种**方法是基于**事件驱动**的，重点在前端。我们可以把客户端调用前端方法理解成**前端注册了一个事件**，等待客户端去触发这个事件**相当于前端监听客户端的这个事件**。因为前端注册方法后并不会立即执行，而是等待触发了客户端某些行为后才会触发，例如`wakeUp`**页面唤醒**事件

既然是事件，肯定可以**注册多次**，并且需要支持**注册事件**、**触发事件**、**卸载事件**等一系列操作，在这里使用**订阅-发布者模式**`EventEmitter`最为适合，这样也就支持了在**多个页面**注册**相同函数（事件）**的功能了

首先开发一个`EventEmitter`，基于它封装三个函数。分别是`Native_on(type, callback)`**监听**客户端方法；`Native_off(type, callback)`**取消监听**客户端方法；`handleMessage(message)`**触发事件**并且参数中会携带**事件**的信息（事件名，回调参数等等），该方法会绑定到`window`上由客户端进行触发。这三个方法的本质就是对`EventEmitter`中的**队列进行维护**

```javascript
class EventEmitter {
  constructor() {
    // 维护事件即事件回调
    this.events = {};
  }

  /**
   * 监听事件
   * @param {string} type 事件名
   * @param {() => any} callback 触发后执行的回调
   */
  on(type, callback) {
    if (!type) return;

    if (this.events[type]) {
      this.events[type].push(callback);
    } else {
      this.events[type] = [callback];
    }
  }

  /**
   * 卸载事件
   * @param {string} type 事件名
   * @param {() => any} callback 监听时的回调
   */
  off(type, callback) {
    if (!type) return;

    if (this.events[type]) {
      this.events[type] = this.events[type].filter((cb) => cb !== callback);
    } else {
      // 事件不存在
    }
  }

  /**
   * 触发事件
   * @param {string} type 事件名
   */
  emit(type) {
    if (!type) return;

    if (this.events[type]) {
      this.events[type].forEach((cb) => {
        typeof cb === "function" && cb();
      });
    } else {
      // 事件不存在
    }
  }
}

// 实例化一个event
const events = new EventEmitter();

function Native_on(type, callback) {
  events.on(type, callback);
}

function Native_off(type, callback) {
  events.off(type, callback);
}

function handleMessage(message) {
  const { type } = message;
  events.emit(type);
}

// 注册到window上，等待客户端调用
window.handleMessage = handleMessage;

function wakeUp() {
  console.log("wakeUp");
}

// 监听事件
Native.on("wakeUp", wakeUp);

// 卸载事件
Native.off("wakeUp", wakeUp);

// 客户端触发事件
window.handleMessage({ type: "wakeUp" });
```

**两种方法比较**

| 特性   | 方法一                                                               | 方法二                                                                                      |
| ------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 复杂度 | **不复杂**，直接将前端方法注入`window`等待客户端调用                 | **复杂**，客户端只需要调用`handleMessage`方法通知前端，大部分工作是有前端完成(EventEmitter) |
| 功能   | 不支持**同一方法**注册多个回调，否则会进行覆盖，最终只能**保留一个** | 支持**同一方法**注册**多个回调**，同时支持**卸载**回调                                      |

使用哪种方法取决于**是否有注册多个回调**的需求，没有则选择方法一非常简单，如果有则必须使用第二种方法

### 通信时参数的数据结构

> **双端**通信必须提前**统一接口数据结构**

**handleMessage**

```json
{
  "type": "", // message类型 event 或者 callback
  "callback_id": "", // 异步回调的callback_id
  "event": "", // 事件名称
  "args": "" // 传给事件回调的参数
}
```
