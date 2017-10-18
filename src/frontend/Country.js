import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import {
	Grid,
	Typography,
} from 'material-ui'

import LeagueList from './LeagueList'

class Country extends React.Component {
	render() {
		const country = this.props.country;
		return (
			<div>
				<Grid container>
					<Grid item>
						 <Typography type="headline">
							{country.name}
						</Typography>
						<LeagueList data={country} leagueClickHandler={this.props.leagueClickHandler} />
					</Grid>
				</Grid>
			</div>
		)
	}
}

export default createFragmentContainer(
	Country,
	graphql`
		fragment Country_country on Country {
			name
			...LeagueList
		}
	`,
);
