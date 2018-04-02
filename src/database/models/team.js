const fetch = require('../fetch')
const utils = require('../utils')

exports.getHistory = (team) => {
  return fetch(`/v2/team/${team.id}/matches`).then(d => {
    if (!d.teams || !d.leagues) {
      return []
    }
    return d.matches.list
      .filter(m => m.status_id === 5)
      .map(m => {
        return {
          id: m.id,
          league: d.leagues.list.find(l => l.id === m.league_id),
          home: utils.getTeam(d.teams.list, m.home.team_id),
          away: utils.getTeam(d.teams.list, m.guest.team_id),
          postponed: false,
          friendly: d.leagues.list.find(l => l.id === m.league_id).name.includes('Friend'),
          homeScore: m.home.results[0],
          awayScore: m.guest.results[0],
          homeScoreHT: m.home.results[1],
          awayScoreHT: m.guest.results[1],
          timestamp: m.start_date,
          _typeName: 'Match'
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100)
  })
}

exports.get = (id) => {
  return fetch(`/v2/team/${id}`).then(d => {
    return {
      id: d.team.id,
      name: d.team.sname,
      fullName: d.team.name,
      _typeName: 'Team'
    }
  })
}
