const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const memoize = require('memoizee')

const DOMAIN_ROOT = 'http://api.futbol24.gluak.com'

const HEADERS = {
  'User-Agent': 'Futbol24 2.25/56 (Google/Pixel; OS 27; 1080x1794@420; eng)',
  'F24-Device-Language': 'eng',
  'F24-App-Version': '2.25',
  'F24-Device-Platform': 'android',
  'F24-App-Id': '1',
  'Host': 'api.futbol24.gluak.com',
  'Connection': 'close',
  'Accept-Encoding': 'gzip, deflate'
}

const cookieJar = request.jar()

const reqOpts = {
  baseUrl: DOMAIN_ROOT,
  headers: HEADERS,
  jar: cookieJar,
  gzip: true
}

const _fetch = (uri, opts) => {
  console.log('GET', uri)
  return request(uri, reqOpts).get('body').then(JSON.parse).get('result')
}

const session = _fetch('/v2/start?platform=android').then(data => { reqOpts.auth = { user: data.user.identity.token } })

const fetch = (uri) => session.then(() => _fetch(uri))

module.exports = memoize(fetch, { maxAge: 10 * 60 * 1000, promise: true, primitive: true })
