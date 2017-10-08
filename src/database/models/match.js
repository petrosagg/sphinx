const fetch = require('../fetch')
const utils = require('../utils')

exports.get = (id) => {
	return fetch(id).then(($) => {
		const [ scoreHome, scoreAway ] = utils.parseScore($('table thead td.result').text())

		return {
			id: url,
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
			timestamp: timestamp,
			_typeName: 'Match',
		}
	})
}
