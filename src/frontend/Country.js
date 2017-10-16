const React = require('react')
const { graphql, createFragmentContainer } = require('react-relay')
const {
	Grid,
	Typography,
} = require('material-ui')

const LeagueList = require('./LeagueList')

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
						<LeagueList data={country} />
					</Grid>
				</Grid>
			</div>
		)
	}
}

module.exports = createFragmentContainer(
	Country,
	graphql`
		fragment Country_country on Country {
			name
			...LeagueList
		}
	`,
);
