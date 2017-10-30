import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { withStyles } from 'material-ui/styles'
import {
  Divider,
  Grid,
  Paper,
  Typography
} from 'material-ui'

import LeagueList from './LeagueList'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  })
})

class Country extends React.Component {
  render () {
    const country = this.props.country
    return (
      <Grid justify='center' spacing={0} container>
        <Grid xs={6} item>
          <Paper className={this.props.classes.root}>
            <Typography type='headline'>
              {country.name}
            </Typography>
            <Divider />
            <LeagueList data={country} leagueClickHandler={this.props.leagueClickHandler} />
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default createFragmentContainer(
  withStyles(styles)(Country),
  graphql`
    fragment Country_country on Country {
      name
      ...LeagueList
    }
  `
)
