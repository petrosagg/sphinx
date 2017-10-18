import React from 'react'
import { graphql, QueryRenderer } from 'react-relay'
import {
	AppBar,
	CircularProgress,
	Toolbar,
	Typography,
} from 'material-ui'

import relay from './relay'
import CountryList from './CountryList'
import Country from './Country'
import League from './League'

export default class App extends React.Component {
	state = {
		country: null,
		league: null,
	}

	handleCountryClick(countryId) {
		this.setState({country: countryId, league: null})
	}

	handleLeagueClick(leagueId) {
		this.setState({country: null, league: leagueId})
	}

	renderState = ({ error, props, retry }) => {
		const title = (
			<AppBar position="static">
				<Toolbar>
					<Typography type="title" color="inherit" onClick={() => this.setState({country: null, league: null})}>
						Sphinx
					</Typography>
				</Toolbar>
			</AppBar>
		)

		if (props) {
			let page = null
			if (this.state.country) {
				page = <Country country={props.country} leagueClickHandler={(id) => this.handleLeagueClick(id)}/>
			} else if (this.state.league) {
				page = <League league={props.league} />
			} else {
				page = <CountryList data={props} countryClickHandler={(id) => this.handleCountryClick(id)} />
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
		if (this.state.country) {
			query = graphql`
				query App_CountryQuery($countryId: String) {
					country(id: $countryId) {
						...Country_country
					}
				}
			`
		} else if (this.state.league) {
			query = graphql`
				query App_LeagueQuery($leagueId: String) {
					league(id: $leagueId) {
						...League_league
					}
				}
			`
		} else {
			query = graphql`
				query App_CountriesQuery {
					...CountryList
				}
			`
		}

		return (
			<QueryRenderer
				environment={relay}
				query={query}
				variables={{
					countryId: this.state.country,
					leagueId: this.state.league,
				}}
				render={this.renderState}
			/>
		)
	}
}
