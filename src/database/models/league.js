const fetch = require('../fetch')

exports.getSeasons = (league) => {
	return fetch(league.id).then(($) => {
		return $('div.desc select option').toArray().map($)
		.map(($el) => {
			return {
				id: $el.attr('value'),
				name: $el.text().trim(),
			}
		})
	})
}

exports.get = (id) => {
	return fetch(id).then(($) => {
		return {
			id: id,
			name: $('div.navbar div.nav2 select option[selected=selected]').text(),
			_typeName: 'League'
		}
	})
}
