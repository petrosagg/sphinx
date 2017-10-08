const pathModule = require('path')
const {
	GraphQLBoolean,
	GraphQLList,
	GraphQLInt,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} = require('graphql')
const {
	fromGlobalId,
	globalIdField,
	nodeDefinitions,
} = require('graphql-relay')

const fetch = require('./database/fetch')
const database = require('./database')

const { nodeInterface, nodeField } = nodeDefinitions(
	(globalId) => {
		const { type, id } = fromGlobalId(globalId);
		return database.getNode[type](id);
	},
	(obj) => schema._typeMap[obj._typeName]
)

const lazyField = (type) => ({
	type: type,
	resolve: (obj, a, b, info) => {
		const prop = info.fieldName
		const type = info.parentType.name

		return typeof obj[prop] !== undefined ? obj[prop] : database.getNode[type](obj.id).get(prop)
	}
})

const Team = new GraphQLObjectType({
	name: 'Team',
	interfaces: [ nodeInterface ],
	fields: () => ({
		id: globalIdField(),
		name: lazyField(GraphQLString),
		fullName: lazyField(GraphQLString),
		history: {
			type: new GraphQLList(Match),
			resolve: database.team.getHistory
		}
	}),
})

const UpcomingMatch = new GraphQLObjectType({
	name: 'UpcomingMatch',
	fields: {
		home: { type: Team },
		away: { type: Team },
		timestamp: lazyField(GraphQLString),
	},
})

const Match = new GraphQLObjectType({
	name: 'Match',
	interfaces: [ nodeInterface ],
	fields: {
		id: globalIdField(),
		home: { type: Team },
		away: { type: Team },
		homeScore: lazyField(GraphQLInt),
		awayScore: lazyField(GraphQLInt),
		postponed: lazyField(GraphQLBoolean),
		timestamp: lazyField(GraphQLString),
	},
})

const Season = new GraphQLObjectType({
	name: 'Season',
	interfaces: [ nodeInterface ],
	fields: {
		id: globalIdField(),
		name: lazyField(GraphQLString),
		upcomingMatches: {
			type: new GraphQLList(UpcomingMatch),
			resolve: database.season.getUpcomingMatches
		},
		matches: {
			type: new GraphQLList(Match),
			resolve: database.season.getMatches
		}
	},
})

const League = new GraphQLObjectType({
	name: 'League',
	interfaces: [ nodeInterface ],
	fields: {
		id: globalIdField(),
		name: lazyField(GraphQLString),
		seasons: {
			type: new GraphQLList(Season),
			resolve: database.league.getSeasons
		}
	},
})

const Country = new GraphQLObjectType({
	name: 'Country',
	interfaces: [ nodeInterface ],
	fields: {
		id: globalIdField(),
		name: lazyField(GraphQLString),
		leagues: {
			type: new GraphQLList(League),
			resolve: database.country.getLeagues
		}
	},
})

const QueryType = new GraphQLObjectType({
	name: 'Query',
	fields: {
		countries: {
			type: new GraphQLList(Country),
			resolve: database.country.getAll
		},
		country: {
			type: Country,
			args: {
				id: { type: GraphQLString }
			},
			resolve: (obj, args) => {
				const { id } = fromGlobalId(args.id)
				return database.country.get(id)
			}
		},
		league: {
			type: League,
			args: {
				id: { type: GraphQLString }
			},
			resolve: (obj, args) => {
				const { id } = fromGlobalId(args.id)
				return database.league.get(id)
			}
		},
		season: {
			type: Season,
			args: {
				id: { type: GraphQLString }
			},
			resolve: (obj, args) => {
				const { id } = fromGlobalId(args.id)
				return database.season.get(id)
			}
		},
		match: {
			type: Season,
			args: {
				id: { type: GraphQLString }
			},
			resolve: (obj, args) => {
				const { id } = fromGlobalId(args.id)
				return database.match.get(id)
			}
		},
		team: {
			type: Team,
			args: {
				id: { type: GraphQLString }
			},
			resolve: (obj, args) => {
				const { id } = fromGlobalId(args.id)
				return database.team.get(id)
			}
		},
		node: nodeField
	},
})

module.exports = schema = new GraphQLSchema({ query: QueryType })
