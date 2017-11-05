const pathModule = require('path')
const express = require('express')
const compression = require('compression')
const graphqlHTTP = require('express-graphql')
const history = require('connect-history-api-fallback')

const schema = require('./schema')

const app = express()

app.use(compression())
app.use(history())
app.use(express.static(pathModule.join(__dirname, '../dist')))

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))

app.listen(process.env.PORT || 4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')
