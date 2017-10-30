import { Environment, Network, RecordSource, Store } from 'relay-runtime'

const fetchQuery = (operation, variables) => {
  return window.fetch('/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  }).then(response => response.json())
}

export default new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
})
