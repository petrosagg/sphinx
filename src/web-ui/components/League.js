import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import {
	Grid,
	Typography,
} from 'material-ui'

import SeasonList from './SeasonList'

class League extends React.Component {
	render() {
		const league = this.props.league;
		return (
			<div>
				<Grid container>
					<Grid item>
						 <Typography type="headline">
							{league.name}
						</Typography>
						<SeasonList data={league} />
					</Grid>
				</Grid>
			</div>
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
