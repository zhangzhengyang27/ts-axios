import { isPlainObject } from './util'

function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

/**
 * 把响应的 headers 字段从字符串解析成对象结构
 * "connection: keep-alive
 * content-length: 13
 * content-type: application/json; charset=utf-8
 * date: Sat, 11 Jun 2022 03:38:52 GMT
 * etag: W/"d-talgBZSHcQOay+ud5zDrtp+2VNk"
 * keep-alive: timeout=5
 * x-powered-by: Express"
 */
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach(line => {
    // 如果vals值有很多的：,需要做下面的特殊处理
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    const val = vals.join(':').trim()
    parsed[key] = val
  })

  return parsed
}
