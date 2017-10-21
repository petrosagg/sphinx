import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import {
	Divider,
	Grid,
	Paper,
	Typography,
} from 'material-ui'

import SeasonList from './SeasonList'

class League extends React.Component {
	render() {
		const league = this.props.league;
		return (
			<Grid justify="center" spacing={0} container>
				<Grid xs={6} item>
					<Paper>
						 <Typography type="headline">
							{league.name}
						</Typography>
						<Divider />
						<SeasonList data={league} seasonClickHandler={this.props.seasonClickHandler} />
					</Paper>
				</Grid>
			</Grid>
		)
	}
}

export default createFragmentContainer(
	League,
	graphql`
		fragment League_league on League {
			name
			...SeasonList
		}
	`,
);
