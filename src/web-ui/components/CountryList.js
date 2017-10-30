import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { withStyles } from 'material-ui/styles'
import {
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  Typography
} from 'material-ui'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  })
})

class CountryList extends React.Component {
  render () {
    const countries = this.props.data.countries.edges.map((e) => e.node)
    if (countries === null) {
      return <div>Could not load data</div>
    }
    return (
      <Grid justify='center' spacing={0} container>
        <Grid xs={6} item>
          <Paper className={this.props.classes.root}>
            <Typography type='headline'>
              Countries
            </Typography>
            <Divider />
            <List>{
              countries.map((country, i) => (
                <ListItem button key={i} onClick={() => this.props.countryClickHandler(country.id)}>
                  {country.name}
                </ListItem>
              ))
            }</List>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default createFragmentContainer(
  withStyles(styles)(CountryList),
  graphql`
    fragment CountryList on Query {
      countries {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `
)
