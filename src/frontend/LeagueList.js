const React = require('react')
const { graphql, createFragmentContainer } = require('react-relay')
const {
	List,
	ListItem,
} = require('material-ui')

class LeagueList extends React.Component {
	render() {
		const leagues = this.props.data.leagues;
		return (
			<List>{
				leagues.map((league, i) => {
					return <ListItem button key={i} onClick={() => this.props.leagueClickHandler(league.id)}>
						{league.name}
					</ListItem>
				})
			}</List>
		)
	}
}

module.exports = createFragmentContainer(
	LeagueList,
	graphql`
		fragment LeagueList on Country {
			leagues {
				id
				name
			}
		}
	`,
);
