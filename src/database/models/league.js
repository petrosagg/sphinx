const fetch = require('../fetch')

exports.getSeasons = (league) => {
	return fetch(league.id).then(($) => {
		return $('div.desc select option').toArray().map($)
		.map(($el) => {
			return {
				id: $el.attr('value'),
				name: $el.text().trim(),
				league: league,
			}
		})
	})
}

exports.get = (id) => {
	return fetch(id).then(($) => {
		const countryHref = $('div.navbar div.nav2 select option').first().attr('value')

		const country = $('.menu .national.list .countries > li').toArray().map($)
		.filter(($el) => $('a', $el).attr('href') === countryHref)
		.map(($el) => {
			return {
				id: $el.attr('data-id'),
				name: $el.text().trim(),
				_typeName: 'Country'
			}
		})[0]

		return {
			id: id,
			name: $('div.navbar div.nav2 select option[selected=selected]').text(),
			country: country,
			_typeName: 'League'
		}
	})
}
