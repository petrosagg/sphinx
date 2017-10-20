import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import {
	List,
	ListItem,
} from 'material-ui'

class LeagueList extends React.Component {
	render() {
		const leagues = this.props.data.leagues;
		return (
			<List>{
				leagues.map((league, i) => {
					return <ListItem button key={i} onClick={() => this.props.leagueClickHandler(league.id)}>
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
		fragment LeagueList on Country {
			leagues {
				id
				name
			}
		}
	`,
);
