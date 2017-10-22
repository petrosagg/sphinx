const fetch = require('../fetch')
const utils = require('../utils')

exports.get = (id) => {
	return fetch(id).then(($) => {
		const [ scoreHome, scoreAway ] = utils.parseScore($('table thead td.result').text())

		return {
			id: id,
			home: {
				id: $('table thead td.home a').attr('href'),
				name: $('table thead td.home').text(),
			},
			away: {
				id: $('table thead td.guest a').attr('href'),
				name: $('table thead td.guest').text(),
			},
			homeScore: scoreHome,
			awayScore: scoreAway,
			season: {
				id: $('span.country a:nth-child(2)').attr('href'),
			},
			timestamp: $('.date.timezone').attr('data-timestamp'),
			_typeName: 'Match',
		}
	})
}
