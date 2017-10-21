import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import {
	Divider,
	Grid,
	List,
	ListItem,
	Paper,
	Typography,
} from 'material-ui'

class CountryList extends React.Component {
	render() {
		const countries = this.props.data.countries;
		if (countries === null) {
			return <div>Could not load data</div>
		}
		return (
			<Grid justify="center" spacing={0} container>
				<Grid xs={6} item>
					<Paper>
						 <Typography type="headline">
							Countries
						</Typography>
						<Divider />
						<List>{
							countries.map((country, i) => (
								<ListItem button key={i} onClick={() => this.props.countryClickHandler(country.id)}>
									{country.name}
								</ListItem>
							))
						}</List>
					</Paper>
				</Grid>
			</Grid>
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
