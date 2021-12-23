### 功能

**主要功能**

1. 前端**同步调用**客户端方法
2. 前端**异步调用**客户端方法，需要传`callback`
3. 客户端**同步调用**前端方法

**辅助功能**

1. 判断当前环境，是**浏览器环境**还是**native 环境**，浏览器环境无`native`方法，需兼容
2. 是否开启 log 模式，会打印函数调用的 log
3. 判断客户端是否有当前函数

### 实现

#### 前端同步调用客户端

最简单的方式就是客户端把方法注册到`window`对象，然后前端直接`window.fn`去触发。

以上方法会存在一些问题

1. 污染全局变量，如果想在`window`对象上添加**同名函数**，会**覆盖**客户端方法
2. 不好进行管理

比较好的方法是将**客户端注入的方法**统一放到`window`对象的**属性中**，例如`window.nativeApi = {}`,

调用客户端某个方法`window.nativeApi.foo(params)`

#### 前端异步调用客户端

**异步调用**其实是由**两次单向**调用组成

前端是无法直接将**异步回调**传给客户端并让其执行的

目前可行的做法是创建一个`map`，`key`为`callbackID`，`value`为`callback`。前端调用客户端方法时将`callbackID`传过去，当客户端需要执行前端回调时，调用前端的指定方法，将这个`callbackID`和`callback 参数`传回前端，前端在根据`callbackID`去找到指定的`callback`，在将参数传给这个`callback`

#### 客户端同步调用前端

前端需要**提前**将**指定方法**注入到**指定对象**中例如`window`对象，等待客户端去触发，这个过程有点像**事件监听**，前端就可以把**客户端调用前端**当作**前端监听客户端触发前端函数**，这样更容易理解。

需要注意的是前端可能需要注册**多个方法方法名相同的函数**，用在客户端的不同场景，例如`wakeUp`事件。由于在前端**方法名相同的函数会进行覆盖**，因此需要一个**队列**来存储这些函数，当函数触发时，执行**队列**中的所有函数

#### 辅助功能