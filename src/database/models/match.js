const fetch = require('../fetch')
const utils = require('../utils')

exports.get = (id) => {
  return fetch(`/v2/match/${id}`).then(d => {
    return {
      id: d.match.id,
      home: utils.getTeam(d.teams.list, d.match.home.team_id),
      away: utils.getTeam(d.teams.list, d.match.guest.team_id),
      homeScore: d.match.home.results[0],
      awayScore: d.match.guest.results[0],
      homeScoreHT: d.match.home.results[1],
      awayScoreHT: d.match.guest.results[1],
      friendly: d.leagues.list.find(l => l.id === d.match.league_id).name.includes('Friend'),
      postponed: false,
      timestamp: d.match.start_date,
      _typeName: 'Match'
    }
  })
}
