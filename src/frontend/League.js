const React = require('react')
const { graphql, createFragmentContainer } = require('react-relay')
const {
	Grid,
	Typography,
} = require('material-ui')

const SeasonList = require('./SeasonList')

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

module.exports = createFragmentContainer(
	League,
	graphql`
		fragment League_league on League {
			name
			...SeasonList
		}
	`,
);
