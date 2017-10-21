import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import {
	List,
	ListItem,
} from 'material-ui'

class SeasonList extends React.Component {
	render() {
		const seasons = this.props.data.seasons;
		return (
			<List>{
				seasons.map((season, i) => (
					<ListItem button key={i} onClick={() => this.props.seasonClickHandler(season.id)}>
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
		fragment SeasonList on League {
			seasons {
				id
				name
			}
		}
	`,
);
