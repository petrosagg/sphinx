const fetch = require('../fetch')

exports.getLeagues = (country) => {
	return fetch('ml/subLeagues/?CountryId=' + country.id).then(($) => {
		return $('li.league').toArray().map($)
		.map(($el) => {
			return {
				id: $('a', $el).attr('href'),
				name: $el.text().trim(),
			}
		})
	})
}

exports.getAll = () => {
	return fetch('/').then(($) => {
		return $('.menu .national.list .countries > li').toArray().map($)
		.map(($el) => {
			return {
				id: $el.attr('data-id'),
				name: $el.text().trim(),
				_typeName: 'Country'
			}
		})
	})
}

exports.get = (id) => exports.getAll().filter((country) => country.id === id).get(0)
