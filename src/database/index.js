exports.country = require('./models/country')
exports.league = require('./models/league')
exports.season = require('./models/season')
exports.match = require('./models/match')
exports.team = require('./models/team')

exports.getNode = {
  'Country': exports.country.get,
  'League': exports.league.get,
  'Season': exports.season.get,
  'Match': exports.match.get,
  'Team': exports.team.get
}
