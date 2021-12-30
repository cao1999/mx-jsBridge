import JsBridge from "./core/JsBridge";

// 创建默认的实例
const jsBridge = new JsBridge();

jsBridge.JsBridge = JsBridge;

// 只有默认实例会有create方法
jsBridge.create = function (config) {
  return new JsBridge(config);
};

export default jsBridge;
