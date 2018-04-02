import React from 'react'
import { graphql, createRefetchContainer } from 'react-relay'
import { withStyles } from 'material-ui/styles'
import {
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  TablePagination,
  Typography
} from 'material-ui'

import history from '../history'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  })
})

class CountryList extends React.Component {
  constructor () {
    super()
    this.page = 0
  }

  render () {
    const countries = this.props.data.countries.edges.map((e) => e.node)
    if (countries === null) {
      return <div>Could not load data</div>
    }
    return (
      <Grid justify='center' spacing={0} container>
        <Grid xs={6} item>
          <Paper className={this.props.classes.root}>
            <Typography variant='headline'>
              Countries
            </Typography>
            <Divider />
            <List>{
              countries.map((country, i) => (
                <ListItem button key={i} onClick={() => history.push('/country/' + country.id)}>
                  {country.name}
                </ListItem>
              ))
            }</List>
            <TablePagination
              component='div'
              count={200}
              rowsPerPage={10}
              page={this.page}
              onChangePage={(a, b) => this.handleChangePage(a, b)}
            />
          </Paper>
        </Grid>
      </Grid>
    )
  }

  handleChangePage (a, nextPage) {
    const forward = this.page < nextPage
    this.page = nextPage

    const refetchVariables = (fragmentVariables) => {
      if (forward) {
        return {
          after: this.props.data.countries.pageInfo.endCursor,
          first: 10,
          last: null
        }
      } else {
        return {
          first: null,
          before: this.props.data.countries.pageInfo.startCursor,
          last: 10
        }
      }
    }

    this.props.relay.refetch(refetchVariables, null)
  }
}

export default createRefetchContainer(
  withStyles(styles)(CountryList),
  graphql`
    fragment CountryList on Query {
      countries(first: 10, after: $after, last: $last, before: $before) {
        edges {
          node {
            id
            name
          }
        }
        pageInfo {
          startCursor
          endCursor
        }
      }
    }
  `,
  graphql`
    query CountryListRefetchQuery($after: String, $last: Int, $before: String) {
      ...CountryList
    }
  `
)
