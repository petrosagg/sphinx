const pathModule = require('path')

const fetch = require('../fetch')
const utils = require('../utils')

exports.getUpcomingMatches = (season) => {
	return fetch(pathModule.join(season.id, 'fixtures')).then(($) => {
		return $('#statLF table.stat tr:not(.timezonebar)').toArray().map((match) => utils.parseMatch($, match))
	})
}

exports.getMatches = (season) => {
	return fetch(pathModule.join(season.id, 'results')).then(($) => {
		return $('#statLR table.stat tr:not(.timezonebar)').toArray().map((match) => utils.parseMatch($, match))
	})
}

exports.get = (id) => {
	return fetch(id).then(($) => {
		return $('div.desc select option').toArray().map($)
		.map(($el) => {
			return {
				id: $el.attr('value'),
				name: $el.text().trim(),
				_typeName: 'Season'
			}
		})
		.filter((season) => season.id === id)[0]
	})
}
