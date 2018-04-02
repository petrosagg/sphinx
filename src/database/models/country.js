const fetch = require('../fetch')

exports.getLeagues = country => {
  return fetch('/v2/competitions').then((d) => {
    return d.competitions.list.filter(c => c.country_id === country.id)
  })
}

exports.getAll = () => {
  return fetch('/v2/competitions').then((data) => {
    return data.countries.list
      .map(c => {
        c._typeName = 'Country'
        return c
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  })
}

exports.get = (id) => exports.getAll().filter((country) => country.id === id).get(0)
