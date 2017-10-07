const pathModule = require('path')
const {
	GraphQLBoolean,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} = require('graphql')

const fetch = require('./fetch')

const Team = new GraphQLObjectType({
	name: 'Team',
	fields: {
		name: { type: GraphQLString },
		url: { type: GraphQLString },
	},
})

const Match = new GraphQLObjectType({
	name: 'Match',
	fields: {
		home: { type: Team },
		away: { type: Team },
		timestamp: { type: GraphQLString },
	},
})

const Season = new GraphQLObjectType({
	name: 'Season',
	fields: {
		name: { type: GraphQLString },
		url: { type: GraphQLString },
		matches: {
			type: new GraphQLList(Match),
			args: {
				upcoming: { type: new GraphQLNonNull(GraphQLBoolean) }
			},
			resolve: (obj, args) => {
				if (args.upcoming) {
					return fetch(pathModule.join(obj.url, 'fixtures')).then(($) => {
						return $('#statLF table.stat tr:not(.timezonebar)').toArray()
						.map((match) => {
							try {
								const homeTeam = $('.team2', match).text() || $('.team4', match).text()
								const homeUrl = $('.team2 a', match).attr('href') || $('.team4 a', match).attr('href')
								const awayTeam = $('.team3', match).text() || $('.team5', match).text()
								const awayUrl = $('.team3 a', match).attr('href') || $('.team5 a', match).attr('href')
								const timestamp = $('.dymek', match).attr('data-timestamp') * 1000

								return {
									home: {
										name: homeTeam,
										url: homeUrl,
									},
									away: {
										name: awayTeam,
										url: awayUrl,
									},
									timestamp: timestamp
								}
							} catch (e) {
								throw new Error("Error " + e + " Couldn't parse " + $(match).html())
							}
						})
					})
				} else {
					throw new Error("Unimplemented")
				}
			}
		}
	},
})

const League = new GraphQLObjectType({
	name: 'League',
	fields: {
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		url: { type: GraphQLString },
		seasons: {
			type: new GraphQLList(Season),
			resolve: (obj) => {
				return fetch(obj.url).then(($) => {
					return $('div.desc select option').toArray().map($)
					.map(($el) => {
						return {
							name: $el.text().trim(),
							url: $el.attr('value'),
						}
					})
				})
			}
		}
	},
})

const Country = new GraphQLObjectType({
	name: 'Country',
	fields: {
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		urlname: { type: GraphQLString },
		leagues: {
			type: new GraphQLList(League),
			args: {
				id: { type: GraphQLInt }
			},
			resolve: (obj, args) => {
				return fetch('ml/subLeagues/?CountryId=' + obj.id).then(($) => {
					return $('li.league').toArray().map($)
					.map(($el) => {
						return {
							id: Number($el.attr('class').split(' ').filter((c) => /l[0-9]+/.test(c))[0].slice(1)),
							name: $el.text().trim(),
							url: $('a', $el).attr('href'),
						}
					})
					.filter((obj) => !args.id || obj.id == args.id)
				})
			}
		}
	},
})

const QueryType = new GraphQLObjectType({
	name: 'Query',
	fields: {
		countries: {
			type: new GraphQLList(Country),
			args: {
				id: { type: GraphQLInt }
			},
			resolve: (obj, args) => {
				return fetch('/').then(($) => {
					return $('.menu .national.list .countries > li').toArray().map($)
					.map(($el) => {
						return {
							id: Number($el.attr('data-id')),
							name: $el.text().trim(),
							urlname: $('a', $el).attr('href').split('/')[2],
							type: 'NATIONAL',
						}
					})
					.filter((obj) => !args.id || obj.id == args.id)
				})
			}
		}
	},
})

module.exports = new GraphQLSchema({ query: QueryType })
