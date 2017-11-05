import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import {
  List,
  ListItem
} from 'material-ui'

import history from '../history'

class LeagueList extends React.Component {
  render () {
    const leagues = this.props.leagues
    return (
      <List>{
        leagues.map((league, i) => {
          return <ListItem button key={i} onClick={() => history.push('/league/' + league.id)}>
            {league.name}
          </ListItem>
        })
      }</List>
    )
  }
}

export default createFragmentContainer(
  LeagueList,
  graphql`
    fragment LeagueList_leagues on League @relay(plural: true) {
      id
      name
    }
  `
)
