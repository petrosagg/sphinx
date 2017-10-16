const React = require('react')
const { graphql, QueryRenderer } = require('react-relay')
const {
	AppBar,
	Icon,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	Toolbar,
	Typography,
} = require('material-ui')

const relay = require('./relay')

class App extends React.Component {
	renderState = ({ error, props, retry }) => {
		if (props) {
			return (
				<div>
					<AppBar position="static">
						<Toolbar>
							<Typography type="title" color="inherit">
								Sphinx
							</Typography>
						</Toolbar>
					</AppBar>
					 <Typography type="headline">
						Pinned Countries
					</Typography>
					<List>{
						props.countries.map((country) => (
							<ListItem button>
								{country.name}
								<ListItemSecondaryAction>
									<IconButton>
										 <Icon color="action">delete</Icon>
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						)).slice(0, 2)
					}</List>
					 <Typography type="headline">
						Countries
					</Typography>
					<List>{
						props.countries.map((country) => (
							<ListItem button>
								{country.name}
								<ListItemSecondaryAction>
									<IconButton>
										 <Icon color="action">bookmark</Icon>
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))
					}</List>
				</div>
			)
		} else {
			return <p>Loading</p>
		}
	}

	render() {
		return (
			<QueryRenderer
				environment={relay}
				query={graphql`
					query App_CountriesQuery {
						countries {
							id
							name
						}
					}
				`}
				render={this.renderState}
			/>
		)
	}
}

module.exports = App
