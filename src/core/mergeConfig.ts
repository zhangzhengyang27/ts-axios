import { AxiosRequestConfig } from '../types'
import { deepMerge, isPlainObject } from '../helpers/util'

const strats = Object.create(null)

// 默认合并策略，优先去取val2的值
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 只取val2的值，忽略val1
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

// 将每一个key指向策略函数
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    // 深拷贝返回一个副本
    return deepMerge(val1)
  } else {
    return val1
  }
}

// 因为 auth 也是一个对象格式，所以它的合并规则是 deepMergeStrat
const stratKeysDeepMerge = ['headers', 'auth']
// 将每一个key指向策略函数
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  // 只有默认的配置中有字段
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    // strat是一个策略函数
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
