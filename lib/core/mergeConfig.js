import { DEFAULT_CONFIG } from "../consts";

export function mergeConfig(config = {}) {
  return Object.assign({}, DEFAULT_CONFIG, config);
}
