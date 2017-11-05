import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import {
  List,
  ListItem
} from 'material-ui'

import history from '../history'

class SeasonList extends React.Component {
  render () {
    const seasons = this.props.seasons
    return (
      <List>{
        seasons.map((season, i) => (
          <ListItem button key={i} onClick={() => history.push('/season/' + season.id)}>
            {season.name}
          </ListItem>
        ))
      }</List>
    )
  }
}

export default createFragmentContainer(
  SeasonList,
  graphql`
    fragment SeasonList_seasons on Season @relay(plural: true) {
      id
      name
    }
  `
)
