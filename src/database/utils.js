exports.getTeam = (teams, id) => {
  const team = teams.find(t => t.id === id)

  return {
    id: id,
    name: team.name,
    fullName: team.name,
    _typeName: 'Team'
  }
}
