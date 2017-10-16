const { Environment, Network, RecordSource, Store } = require('relay-runtime')

const fetchQuery = (operation, variables) => {
	return fetch('/graphql', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({
			query: operation.text,
			variables,
		}),
	}).then(response => response.json())
}

module.exports = new Environment({
	network: Network.create(fetchQuery),
	store: new Store(new RecordSource()),
})
