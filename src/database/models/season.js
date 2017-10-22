const pathModule = require('path')

const fetch = require('../fetch')
const utils = require('../utils')

exports.getUpcomingMatches = (season) => {
	return fetch(pathModule.join(season.id, 'fixtures')).then(($) => (
		$('#statLF table.stat tr:not(.timezonebar)')
		.toArray()
		.map((match) => utils.parseMatch($, match))
		.map((match) => {
			match.season = season
			return match
		})
	))
}

exports.getMatches = (season) => {
	return fetch(pathModule.join(season.id, 'results')).then(($) => (
		$('#statLR table.stat tr:not(.timezonebar)')
		.toArray()
		.map((match) => utils.parseMatch($, match))
		.map((match) => {
			match.season = season
			return match
		})
	))
}

exports.get = (id) => {
	return fetch(id).then(($) => {
		const $league = $('div.navbar div.nav2 select option[selected=selected]')

		return $('div.desc select option').toArray().map($)
		.map(($el) => {
			return {
				id: $el.attr('value'),
				name: $el.text().trim(),
				league: {
					id: $league.attr('value'),
					name: $league.text().trim(),
				},
				_typeName: 'Season'
			}
		})
		.filter((season) => season.id === id)[0]
	})
}
