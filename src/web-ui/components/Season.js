import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { withStyles } from 'material-ui/styles'
import {
	Divider,
	Grid,
	Paper,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Typography,
} from 'material-ui'

const styles = theme => ({
	root: theme.mixins.gutters({
		paddingTop: 16,
		marginTop: theme.spacing.unit * 3,
		marginBottom: theme.spacing.unit * 3,
	}),
})

class Season extends React.Component {
	render() {
		const season = this.props.season;
		return (
			<Grid justify="center" spacing={0} container>
				<Grid item>
					<Paper className={this.props.classes.root}>
						<Typography type="headline">
							{season.league.country.name} > {season.league.name} > {season.name}
						</Typography>
						<Divider />
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Timestamp</TableCell>
									<TableCell>Home</TableCell>
									<TableCell>Away</TableCell>
									<TableCell>Score Home</TableCell>
									<TableCell>Score Away</TableCell>
									<TableCell>Postponed</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{season.matches.edges.map(({ node: m }, i) => (
									<TableRow hover key={i}>
										<TableCell>{new Date(m.timestamp * 1000).toLocaleString()}</TableCell>
										<TableCell>{m.home.name}</TableCell>
										<TableCell>{m.away.name}</TableCell>
										<TableCell>{m.homeScore}</TableCell>
										<TableCell>{m.awayScore}</TableCell>
										<TableCell>{m.postponed ? 'yes' : 'no'}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Paper>
				</Grid>
			</Grid>
		)
	}
}

export default createFragmentContainer(
	withStyles(styles)(Season),
	graphql`
		fragment Season_season on Season {
			name
			league {
				name
				country {
					name
				}
			}
			matches {
				edges {
					node {
						timestamp
						home {
							name
						}
						away {
							name
						}
						homeScore
						awayScore
						postponed
					}
				}
			}
		}
	`,
);
