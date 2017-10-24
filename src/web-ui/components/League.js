import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { withStyles } from 'material-ui/styles'
import {
	Divider,
	Grid,
	Paper,
	Typography,
} from 'material-ui'

import SeasonList from './SeasonList'

const styles = theme => ({
	root: theme.mixins.gutters({
		paddingTop: 16,
		marginTop: theme.spacing.unit * 3,
		marginBottom: theme.spacing.unit * 3,
	}),
})

class League extends React.Component {
	render() {
		const league = this.props.league;
		return (
			<Grid justify="center" spacing={0} container>
				<Grid xs={6} item>
					<Paper className={this.props.classes.root}>
						 <Typography type="headline">
							{league.country.name} > {league.name}
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
	withStyles(styles)(League),
	graphql`
		fragment League_league on League {
			name
			country {
				name
			}
			...SeasonList
		}
	`,
);
