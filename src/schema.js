const {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = require('graphql')
const {
  connectionArgs,
  connectionDefinitions,
  connectionFromPromisedArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions
} = require('graphql-relay')

const database = require('./database')

const resolveNode = (globalId) => {
  const { type, id } = fromGlobalId(globalId)
  return database.getNode[type](id)
}

const { nodeInterface, nodeField } = nodeDefinitions(resolveNode, (obj) => schema._typeMap[obj._typeName])

const lazyField = (type) => ({
  type: type,
  resolve: (obj, a, b, info) => {
    const prop = info.fieldName
    const type = info.parentType.name

    return typeof obj[prop] !== 'undefined' ? obj[prop] : database.getNode[type](obj.id).get(prop)
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
      type: MatchConnection,
      args: connectionArgs,
      resolve: (team, args) => {
        return connectionFromPromisedArray(database.team.getMatches(team), args)
      }
    }
  })
})

const UpcomingMatch = new GraphQLObjectType({
  name: 'UpcomingMatch',
  fields: () => ({
    home: { type: Team },
    away: { type: Team },
    season: lazyField(Season),
    timestamp: lazyField(GraphQLInt)
  })
})

const Match = new GraphQLObjectType({
  name: 'Match',
  interfaces: [ nodeInterface ],
  fields: () => ({
    id: globalIdField(),
    home: { type: Team },
    away: { type: Team },
    season: lazyField(Season),
    homeScore: lazyField(GraphQLInt),
    awayScore: lazyField(GraphQLInt),
    postponed: lazyField(GraphQLBoolean),
    timestamp: lazyField(GraphQLInt)
  })
})

const Season = new GraphQLObjectType({
  name: 'Season',
  interfaces: [ nodeInterface ],
  fields: () => ({
    id: globalIdField(),
    name: lazyField(GraphQLString),
    upcomingMatches: {
      type: UpcomingMatchConnection,
      args: connectionArgs,
      resolve: (season, args) => {
        return connectionFromPromisedArray(database.season.getUpcomingMatches(season), args)
      }
    },
    matches: {
      type: MatchConnection,
      args: connectionArgs,
      resolve: (season, args) => {
        return connectionFromPromisedArray(database.season.getMatches(season), args)
      }
    },
    league: lazyField(League)
  })
})

const League = new GraphQLObjectType({
  name: 'League',
  interfaces: [ nodeInterface ],
  fields: () => ({
    id: globalIdField(),
    name: lazyField(GraphQLString),
    seasons: {
      type: SeasonConnection,
      args: connectionArgs,
      resolve: (league, args) => {
        return connectionFromPromisedArray(database.league.getSeasons(league), args)
      }
    },
    country: lazyField(Country)
  })
})

const Country = new GraphQLObjectType({
  name: 'Country',
  interfaces: [ nodeInterface ],
  fields: () => ({
    id: globalIdField(),
    name: lazyField(GraphQLString),
    leagues: {
      type: LeagueConnection,
      args: connectionArgs,
      resolve: (country, args) => {
        return connectionFromPromisedArray(database.country.getLeagues(country), args)
      }
    }
  })
})

const CountryConnection = connectionDefinitions({ nodeType: Country }).connectionType
const LeagueConnection = connectionDefinitions({ nodeType: League }).connectionType
const SeasonConnection = connectionDefinitions({ nodeType: Season }).connectionType
const MatchConnection = connectionDefinitions({ nodeType: Match }).connectionType
const UpcomingMatchConnection = connectionDefinitions({ nodeType: UpcomingMatch }).connectionType

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    countries: {
      type: CountryConnection,
      args: connectionArgs,
      resolve: (obj, args) => {
        return connectionFromPromisedArray(database.country.getAll(), args)
      }
    },
    country: {
      type: Country,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (obj, args) => resolveNode(args.id)
    },
    league: {
      type: League,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (obj, args) => resolveNode(args.id)
    },
    season: {
      type: Season,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (obj, args) => resolveNode(args.id)
    },
    match: {
      type: Match,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (obj, args) => resolveNode(args.id)
    },
    team: {
      type: Team,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (obj, args) => resolveNode(args.id)
    },
    node: nodeField
  }
})

const schema = module.exports = new GraphQLSchema({ query: QueryType })
