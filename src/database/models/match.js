const fetch = require('../fetch')
const utils = require('../utils')

exports.get = (id) => {
  return fetch(id).then(($) => {
    const [ postponed, scoreHome, scoreAway ] = utils.parseScore($('table thead td.result').text())

    let scoreHomeHT, scoreAwayHT
    const rawHT = $('table tbody tr').toArray().find((el) => $('td.status', el).text() === 'HT')
    if (rawHT) {
      [ scoreHomeHT, scoreAwayHT ] = utils.parseScore($('td.result', rawHT).text()).slice(1)
    }

    return {
      id: id,
      home: {
        id: $('table thead td.home a').attr('href'),
        name: $('table thead td.home').text()
      },
      away: {
        id: $('table thead td.guest a').attr('href'),
        name: $('table thead td.guest').text()
      },
      homeScore: scoreHome,
      awayScore: scoreAway,
      homeScoreHT: scoreHomeHT,
      awayScoreHT: scoreAwayHT,
      postponed: postponed,
      season: {
        id: $('span.country a:nth-child(2)').attr('href')
      },
      timestamp: $('.date.timezone').attr('data-timestamp'),
      _typeName: 'Match'
    }
  })
}
