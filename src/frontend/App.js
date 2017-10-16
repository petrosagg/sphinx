const React = require('react')
const { graphql, QueryRenderer } = require('react-relay')
const {
	AppBar,
	CircularProgress,
	Toolbar,
	Typography,
} = require('material-ui')

const relay = require('./relay')
const CountryList = require('./CountryList')
const Country = require('./Country')

class App extends React.Component {
	state = {
		country: null
	}

	handleCountryClick(countryId) {
		this.setState({country: countryId})
	}

	renderState = ({ error, props, retry }) => {
		const title = (
			<AppBar position="static">
				<Toolbar>
					<Typography type="title" color="inherit">
						Sphinx
					</Typography>
				</Toolbar>
			</AppBar>
		)

		if (props) {
			let page = null
			if (this.state.country == null) {
				 page = <CountryList data={props} countryClickHandler={(id) => this.handleCountryClick(id)} />
			} else {
				page = <Country country={props.country} />
			}

			return (
				<div>
					{title}
					{page}
				</div>
			)
		} else {
			return (
				<div>
					{title}
					<CircularProgress />
				</div>
			)
		}
	}

	render() {
		let query = null
		if (this.state.country == null) {
			query = graphql`
				query App_CountriesQuery {
					...CountryList
				}
			`
		} else {
			query = graphql`
				query App_CountryQuery($countryId: String) {
					country(id: $countryId) {
						...Country_country
					}
				}
			`
		}

		return (
			<QueryRenderer
				environment={relay}
				query={query}
				variables={{
					countryId: this.state.country
				}}
				render={this.renderState}
			/>
		)
	}
}

module.exports = App
