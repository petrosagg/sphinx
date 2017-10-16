const fs = require('fs')
const path = require('path')
const { printSchema } = require('graphql')

const schema = require('../src/schema')

const schemaPath = path.resolve(__dirname, '../src/frontend/schema.graphql')

fs.writeFileSync(schemaPath, printSchema(schema))

console.log('Wrote ' + schemaPath)
