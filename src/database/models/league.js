const fetch = require('../fetch')

exports.getSeasons = (league) => {
  return fetch(`/v2/competition/${league.id}/fixtures`).then((d) => {
    d.season.id = league.id
    d.season.league = league
    return [ d.season ]
  })
}

exports.get = (id) => {
  return fetch(`/v2/competition/${id}/fixtures`).then((d) => {
    const league = d.competitions.list[0]
    league.country = d.countries.list.find(c => c.id === league.country_id)
    league.country._typeName = 'Country'
    league._typeName = 'League'
    return league
  })
}
