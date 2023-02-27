const toString = Object.prototype.toString


// val is Date 类型保护
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// 判断对象的方式不准确
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}


// val is Object 类型保护
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
