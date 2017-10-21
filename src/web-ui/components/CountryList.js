import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import {
	AppBar,
	CircularProgress,
	Grid,
	List,
	ListItem,
	Toolbar,
	Typography,
} from 'material-ui'

class CountryList extends React.Component {
	render() {
		const countries = this.props.data.countries;
		if (countries === null) {
			return <div>Could not load data</div>
		}
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
								</ListItem>
							))
						}</List>
					</Grid>
				</Grid>
			</div>
		)
	}
}

export default createFragmentContainer(
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
