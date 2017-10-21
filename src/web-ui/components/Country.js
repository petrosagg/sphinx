import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import {
	Divider,
	Grid,
	Paper,
	Typography,
} from 'material-ui'

import LeagueList from './LeagueList'

class Country extends React.Component {
	render() {
		const country = this.props.country;
		return (
			<Grid justify="center" spacing={0} container>
				<Grid xs={6} item>
					<Paper>
						<Typography type="headline">
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
	Country,
	graphql`
		fragment Country_country on Country {
			name
			...LeagueList
		}
	`,
);
