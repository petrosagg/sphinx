const React = require('react')
const { graphql, createFragmentContainer } = require('react-relay')
const {
	List,
	ListItem,
} = require('material-ui')

class SeasonList extends React.Component {
	render() {
		const seasons = this.props.data.seasons;
		return (
			<List>{
				seasons.map((season, i) => (
					<ListItem button key={i}>
						{season.name}
					</ListItem>
				))
			}</List>
		)
	}
}

module.exports = createFragmentContainer(
	SeasonList,
	graphql`
		fragment SeasonList on League {
			seasons {
				id
				name
			}
		}
	`,
);
