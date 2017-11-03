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
  }),
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
    return (
      <Grid justify='center' spacing={0} container>
        <Grid item>
          <Paper className={this.props.classes.root}>
            <Typography type='headline'>
              {season.league.country.name} > {season.league.name} > {season.name}
            </Typography>
            <Divider />
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
                  <TableCell className={this.props.classes.cellSep}>Postponed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {season.matches.edges.map(({ node: m }, i) => {
                  const homeForm = getTeamForm(m.home, m.home.history.edges.filter(({ node: h }) => h.timestamp < m.timestamp))
                  const awayForm = getTeamForm(m.away, m.away.history.edges.filter(({ node: h }) => h.timestamp < m.timestamp))

                  return <TableRow hover key={i}>
                    <TableCell className={this.props.classes.cellNormal}>{new Date(m.timestamp * 1000).toLocaleString()}</TableCell>
                    <TableCell className={this.props.classes.cellNormal}>{m.home.name}</TableCell>
                    <TableCell className={this.props.classes.cellNormal}>{m.away.name}</TableCell>
                    <TableCell className={this.props.classes.cellNormal}>{`${m.homeScore}-${m.awayScore}`}</TableCell>
                    <TableCell className={this.props.classes.cellNormal}>{`${m.homeScoreHT}-${m.awayScoreHT}`}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm.form2}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm.form3}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm.form4}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm.form5}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm.form6}</TableCell>
                    <TableCell className={this.props.classes.cell}>{homeForm.form7}</TableCell>
                    <TableCell className={this.props.classes.cellSep}>{awayForm.form2}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm.form3}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm.form4}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm.form5}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm.form6}</TableCell>
                    <TableCell className={this.props.classes.cell}>{awayForm.form7}</TableCell>
                    <TableCell className={this.props.classes.cellSep}>{m.postponed ? 'yes' : 'no'}</TableCell>
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
