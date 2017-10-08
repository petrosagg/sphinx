const pathModule = require('path')

const fetch = require('../fetch')
const utils = require('../utils')

exports.getHistory = (team) => {
	return fetch(pathModule.join(team.id, 'results')).then(($) => {
		return $('#statTR table.stat tr:not(.timezonebar)').toArray().map((match) => utils.parseMatch($, match))
	})
}

exports.get = (id) => {
	return fetch(id).then(($) => {
		return {
			id: id,
			name: $('div.teaminfo a.team_logo img').attr('alt'),
			fullName: $('div.teaminfo span.teamname').text(),
			_typeName: 'Team'
		}
	})
}
