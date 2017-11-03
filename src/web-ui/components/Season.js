import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { withStyles } from 'material-ui/styles'
import {
  Divider,
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
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  })
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
    return (
      <Grid justify='left' spacing={0} container>
        <Grid item>
          <Paper className={this.props.classes.root}>
            <Typography type='headline'>
              {season.league.country.name} > {season.league.name} > {season.name}
            </Typography>
            <Divider />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Home</TableCell>
                  <TableCell>Away</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Score HT</TableCell>
                  <TableCell>Home F1</TableCell>
                  <TableCell>Home F2</TableCell>
                  <TableCell>Home F3</TableCell>
                  <TableCell>Home F5</TableCell>
                  <TableCell>Home F6</TableCell>
                  <TableCell>Home F7</TableCell>
                  <TableCell>Away F1</TableCell>
                  <TableCell>Away F2</TableCell>
                  <TableCell>Away F3</TableCell>
                  <TableCell>Away F5</TableCell>
                  <TableCell>Away F6</TableCell>
                  <TableCell>Away F7</TableCell>
                  <TableCell>Postponed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {season.matches.edges.map(({ node: m }, i) => {
                  const homeForm = getTeamForm(m.home, m.home.history.edges.filter(({ node: h }) => h.timestamp < m.timestamp))
                  const awayForm = getTeamForm(m.away, m.away.history.edges.filter(({ node: h }) => h.timestamp < m.timestamp))

                  return <TableRow hover key={i}>
                    <TableCell>{new Date(m.timestamp * 1000).toLocaleString()}</TableCell>
                    <TableCell>{m.home.name}</TableCell>
                    <TableCell>{m.away.name}</TableCell>
                    <TableCell>{`${m.homeScore}-${m.awayScore}`}</TableCell>
                    <TableCell>{`${m.homeScoreHT}-${m.awayScoreHT}`}</TableCell>
                    <TableCell>{homeForm.form2}</TableCell>
                    <TableCell>{homeForm.form3}</TableCell>
                    <TableCell>{homeForm.form4}</TableCell>
                    <TableCell>{homeForm.form5}</TableCell>
                    <TableCell>{homeForm.form6}</TableCell>
                    <TableCell>{homeForm.form7}</TableCell>
                    <TableCell>{awayForm.form2}</TableCell>
                    <TableCell>{awayForm.form3}</TableCell>
                    <TableCell>{awayForm.form4}</TableCell>
                    <TableCell>{awayForm.form5}</TableCell>
                    <TableCell>{awayForm.form6}</TableCell>
                    <TableCell>{awayForm.form7}</TableCell>
                    <TableCell>{m.postponed ? 'yes' : 'no'}</TableCell>
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
