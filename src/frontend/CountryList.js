const React = require('react')
const { graphql, createFragmentContainer } = require('react-relay')
const {
	AppBar,
	CircularProgress,
	Icon,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	Toolbar,
	Typography,
} = require('material-ui')

class CountryList extends React.Component {
	state = {
		pinnedCountries: []
	}

	add(country) {
		this.state.pinnedCountries.push(country)
		this.setState({ pinnedCountries: this.state.pinnedCountries })
	}

	remove(country) {
		const i = this.state.pinnedCountries.indexOf(country)
		this.state.pinnedCountries.splice(i, 1)
		this.setState({ pinnedCountries: this.state.pinnedCountries })
	}

	render() {
		const countries = this.props.data.countries;
		return (
			<div>
				<Grid container>
					<Grid xs="4" item>
						 <Typography type="headline">
							Countries
						</Typography>
						<List>{
							countries.map((country, i) => (
								<ListItem button key={i} onClick={() => this.props.countryClickHandler(country.id)}>
									{country.name}
									<ListItemSecondaryAction>
										<IconButton onClick={() => this.add(country)}>
											 <Icon color="action">bookmark</Icon>
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							))
						}</List>
					</Grid>
					<Grid xs="4" item>
						 <Typography type="headline">
							Pinned Countries
						</Typography>
						<List>{
							this.state.pinnedCountries.map((country, i) => (
								<ListItem button key={i}>
									{country.name}
									<ListItemSecondaryAction>
										<IconButton onClick={() => this.remove(country)}>
											 <Icon color="action">delete</Icon>
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							))
						}</List>
					</Grid>
				</Grid>
			</div>
		)
	}
}

module.exports = createFragmentContainer(
	CountryList,
	graphql`
		fragment CountryList on Query {
			countries {
				id
				name
			}
		}
	`,
);
