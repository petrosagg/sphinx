const Promise = require('bluebird')
const cheerio = require('cheerio')
const request = Promise.promisify(require('request'))
const memoize = require('memoizee')

const DOMAIN_ROOT = 'http://www.futbol24.com'

const HEADERS = {
  'Accept-Encoding': 'gzip, deflate, sdch',
  'Accept-Language': 'en,el;q=0.8,fr;q=0.6',
  'Accept': 'text/html, */*; q=0.01',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'DNT': '1',
  'Pragma': 'no-cache',
  'Referer': 'http://www.futbol24.com/'
}

const fetch = (uri, opts) => {
  console.log('GET', uri)

  let headers = HEADERS
  if (opts && opts.xhr) {
    headers = Object.create(HEADERS)
    headers['X-Requested-With'] = 'XMLHttpRequest'
  }

  const reqOpts = {
    baseUrl: DOMAIN_ROOT,
    uri: uri,
    headers: headers,
    gzip: true
  }
  return request(reqOpts).get('body').then(cheerio.load)
}

module.exports = memoize(fetch, { maxAge: 10 * 60 * 1000, promise: true, primitive: true })
