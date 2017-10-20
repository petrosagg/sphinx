const fs = require('fs')
const { printSchema } = require('graphql')

const schema = require('../src/schema')

fs.writeFileSync('.schema.graphql', printSchema(schema))
