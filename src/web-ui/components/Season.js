import React from 'react'
import { CSVLink } from 'react-csv'
import { graphql, createFragmentContainer } from 'react-relay'
import { withStyles } from 'material-ui/styles'
import {
  Button,
  Grid,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography
} from 'material-ui'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  }),
  csvButton: {
    float: 'right'
  },
  cellNormal: {
    paddingLeft: 8,
    paddingRight: 8
  },
  cell: {
    paddingLeft: 3,
    paddingRight: 3
  },
  cellSep: {
    paddingLeft: 10,
    paddingRight: 3
  }
})

// results = [ 0, 2, 1, 1, 0 ]
const form = (results, n) => {
  const ret = [ 0, 0, 0 ]
  for (const i of results.slice(0, n)) {
    ret[i] += 1
  }

  return ret.join('.')
}

const getTeamForm = (team, matches) => {
  const results = []

  matches = matches.slice(0, 7)

  if (matches.length < 7 || matches.some((m) => m.postponed || m.friendly)) {
    return null
  }

  for (const { node: match } of matches) {
    let ourScore, otherScore
    if (match.home.id === team.id) {
      ourScore = match.homeScore
      otherScore = match.awayScore
    } else {
      ourScore = match.awayScore
      otherScore = match.homeScore
    }

    if (ourScore > otherScore) {
      results.push(0)
    } else if (ourScore < otherScore) {
      results.push(2)
    } else {
      results.push(1)
    }
  }

  return {
    form2: form(results, 2),
    form3: form(results, 3),
    form4: form(results, 4),
    form5: form(results, 5),
    form6: form(results, 6),
    form7: form(results, 7)
  }
}

class Season extends React.Component {
  render () {
    const season = this.props.season

    const seenTeams = new Set()
    const upcomingMatches = season.upcomingMatches.edges.map(e => e.node).filter(m => {
      const ret = !seenTeams.has(m.home.name) && !seenTeams.has(m.away.name)
      seenTeams.add(m.home.name)
      seenTeams.add(m.away.name)
      return ret
    })

    const pastMatches = season.matches.edges.map(e => e.node).filter(m => !m.postponed)

    const futureCSVData = [
      [
        'time', 'home', 'away', 'form_home_2', 'form_away_2', 'form_home_3',
        'form_away_3', 'form_home_4', 'form_away_4', 'form_home_5',
        'form_away_5', 'form_home_6', 'form_away_6', 'form_home_7',
        'form_away_7'
      ]
    ]

    for (const match of upcomingMatches) {
      const homeForm = getTeamForm(match.home, match.home.history.edges.filter(({ node: h }) => h.timestamp < match.timestamp))
      const awayForm = getTeamForm(match.away, match.away.history.edges.filter(({ node: h }) => h.timestamp < match.timestamp))

      if (homeForm && awayForm) {
        futureCSVData.push([
          (new Date(match.timestamp * 1000)).toISOString(),
          match.home.name,
          match.away.name,
          homeForm.form2,
          awayForm.form2,
          homeForm.form3,
          awayForm.form3,
          homeForm.form4,
          awayForm.form4,
          homeForm.form5,
          awayForm.form5,
          homeForm.form6,
          awayForm.form6,
          homeForm.form7,
          awayForm.form7
        ])
      }
    }

    const pastCSVData = [
      [
        'time', 'home', 'away', 'score', 'scoreHT', 'form_home_2',
        'form_away_2', 'form_home_3', 'form_away_3', 'form_home_4',
        'form_away_4', 'form_home_5', 'form_away_5', 'form_home_6',
        'form_away_6', 'form_home_7', 'form_away_7'
      ]
    ]

    for (const match of pastMatches) {
      const homeForm = getTeamForm(match.home, match.home.history.edges.filter(({ node: h }) => h.timestamp < match.timestamp))
      const awayForm = getTeamForm(match.away, match.away.history.edges.filter(({ node: h }) => h.timestamp < match.timestamp))

      if (homeForm && awayForm) {
        pastCSVData.push([
          (new Date(match.timestamp * 1000)).toISOString(),
          match.home.name,
          match.away.name,
          `${match.homeScore}-${match.awayScore}`,
          match.homeScoreHT ? `${match.homeScoreHT}-${match.awayScoreHT}` : '',
          homeForm.form2,
          awayForm.form2,
          homeForm.form3,
          awayForm.form3,
          homeForm.form4,
          awayForm.form4,
          homeForm.form5,
          awayForm.form5,
          homeForm.form6,
          awayForm.form6,
          homeForm.form7,
          awayForm.form7
        ])
      }
    }

    return (
      <Grid justify='center' spacing={0} container>
        <Grid item>
          <Paper className={this.props.classes.root}>
            <Typography type='title'>
              {season.league.country.name} » {season.league.name} » {season.name}
            </Typography>
          </Paper>
          <Paper className={this.props.classes.root}>
            <Typography type='subheading'>
              Future Matches
              <CSVLink
                data={futureCSVData}
                filename={[
                  season.league.country.name,
                  season.league.name,
                  'future',
                  (new Date()).toISOString().slice(0, 10)
                ].join('-') + '.csv'
              }>
                <Button className={this.props.classes.csvButton} raised color='primary'>
                  Download
                </Button>
              </CSVLink>
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={this.props.classes.cellNormal}>Timestamp</TableCell>
                  <TableCell className={this.props.classes.cellNormal}>Home</TableCell>
                  <TableCell className={this.props.classes.cellNormal}>Away</TableCell>
                  <TableCell className={this.props.classes.cell} colSpan={6}>Home Form</TableCell>
                  <TableCell className={this.props.classes.cellSep} colSpan={6}>Away Form</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingMatches.map((m, i) => {
                  const homeForm = getTeamForm(m.home, m.home.history.edges.filter(({ node: h }) => h.timestamp < m.timestamp))
                  const awayForm = getTeamForm(m.away, m.away.history.edges.filter(({ node: h }) => h.timestamp < m.timestamp))

                  return <TableRow hover key={i}>
                    <TableCell className={this.props.classes.cellNormal}>{new Date(m.timestamp * 1000).toLocaleString()}</TableCell>
                    <TableCell className={this.props.classes.cellNormal}>{m.home.name}</TableCell>
                    <TableCell className={this.props.classes.cellNormal}>{m.away.name}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm ? homeForm.form2 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm ? homeForm.form3 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm ? homeForm.form4 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm ? homeForm.form5 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm ? homeForm.form6 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm ? homeForm.form7 : ''}</TableCell>
                    <TableCell className={this.props.classes.cellSep}>{awayForm ? awayForm.form2 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm ? awayForm.form3 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm ? awayForm.form4 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm ? awayForm.form5 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm ? awayForm.form6 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm ? awayForm.form7 : ''}</TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </Paper>
          <Paper className={this.props.classes.root}>
            <Typography type='subheading'>
              Past Matches
              <CSVLink
                data={pastCSVData}
                filename={[
                  season.league.country.name,
                  season.league.name,
                  'past',
                  (new Date()).toISOString().slice(0, 10)
                ].join('-') + '.csv'
              }>
                <Button className={this.props.classes.csvButton} raised color='primary'>
                  Download
                </Button>
              </CSVLink>
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={this.props.classes.cellNormal}>Timestamp</TableCell>
                  <TableCell className={this.props.classes.cellNormal}>Home</TableCell>
                  <TableCell className={this.props.classes.cellNormal}>Away</TableCell>
                  <TableCell className={this.props.classes.cellNormal}>Score</TableCell>
                  <TableCell className={this.props.classes.cellNormal}>Score HT</TableCell>
                  <TableCell className={this.props.classes.cell} colSpan={6}>Home Form</TableCell>
                  <TableCell className={this.props.classes.cellSep} colSpan={6}>Away Form</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pastMatches.map((m, i) => {
                  const homeForm = getTeamForm(m.home, m.home.history.edges.filter(({ node: h }) => h.timestamp < m.timestamp))
                  const awayForm = getTeamForm(m.away, m.away.history.edges.filter(({ node: h }) => h.timestamp < m.timestamp))

                  return <TableRow hover key={i}>
                    <TableCell className={this.props.classes.cellNormal}>{new Date(m.timestamp * 1000).toLocaleString()}</TableCell>
                    <TableCell className={this.props.classes.cellNormal}>{m.home.name}</TableCell>
                    <TableCell className={this.props.classes.cellNormal}>{m.away.name}</TableCell>
                    <TableCell className={this.props.classes.cellNormal}>{`${m.homeScore}-${m.awayScore}`}</TableCell>
                    <TableCell className={this.props.classes.cellNormal}>{m.homeScoreHT !== null ? `${m.homeScoreHT}-${m.awayScoreHT}` : 'N/A'}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm ? homeForm.form2 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm ? homeForm.form3 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm ? homeForm.form4 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm ? homeForm.form5 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm ? homeForm.form6 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm ? homeForm.form7 : ''}</TableCell>
                    <TableCell className={this.props.classes.cellSep}>{awayForm ? awayForm.form2 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm ? awayForm.form3 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm ? awayForm.form4 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm ? awayForm.form5 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm ? awayForm.form6 : ''}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm ? awayForm.form7 : ''}</TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default createFragmentContainer(
  withStyles(styles)(Season),
  graphql`
    fragment Season_season on Season {
      name
      league {
        name
        country {
          name
        }
      }
      upcomingMatches {
        edges {
          node {
            timestamp
            home {
              id
              name
              history {
                edges {
                  node {
                    home {
                      id
                    }
                    homeScore
                    awayScore
                    friendly
                    postponed
                    timestamp
                  }
                }
              }
            }
            away {
              id
              name
              history {
                edges {
                  node {
                    home {
                      id
                    }
                    homeScore
                    awayScore
                    friendly
                    postponed
                    timestamp
                  }
                }
              }
            }
          }
        }
      }
      matches {
        edges {
          node {
            timestamp
            home {
              id
              name
              history {
                edges {
                  node {
                    home {
                      id
                    }
                    homeScore
                    awayScore
                    friendly
                    postponed
                    timestamp
                  }
                }
              }
            }
            away {
              id
              name
              history {
                edges {
                  node {
                    home {
                      id
                    }
                    homeScore
                    awayScore
                    friendly
                    postponed
                    timestamp
                  }
                }
              }
            }
            homeScore
            awayScore
            homeScoreHT
            awayScoreHT
            postponed
          }
        }
      }
    }
  `
)
