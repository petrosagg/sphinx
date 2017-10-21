import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
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

class Season extends React.Component {
	render() {
		const season = this.props.season;
		return (
			<Grid justify="center" spacing={0} container>
				<Grid item>
					<Paper>
						<Typography type="headline">
							{season.name}
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
								{season.matches.map((m, i) => (
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
	Season,
	graphql`
		fragment Season_season on Season {
			name
			matches {
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
	`,
);
