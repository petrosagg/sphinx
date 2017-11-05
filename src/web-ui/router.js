import React from 'react'
import UniversalRouter from 'universal-router'
import { graphql } from 'relay-runtime'

import CountryList from './components/CountryList'
import Country from './components/Country'
import League from './components/League'
import Season from './components/Season'

const routes = [
  {
    path: '/',
    query: graphql`
      query router_CountriesQuery($after: String, $last: Int, $before: String) {
        ...CountryList
      }
    `,
    render: props => <CountryList data={props} />
  },
  {
    path: '/country/:id',
    query: graphql`
      query router_CountryQuery($id: String) {
        ...Country
      }
    `,
    render: props => <Country data={props} />
  },
  {
    path: '/league/:id',
    query: graphql`
      query router_LeagueQuery($id: String) {
        ...League
      }
    `,
    render: props => <League data={props} />
  },
  {
    path: '/season/:id',
    query: graphql`
      query router_SeasonQuery($id: String) {
        ...Season
      }
    `,
    render: props => <Season data={props} />
  }
]

const resolveRoute = ({ route, next }, params) => route.render ? { ...route, params } : next()

export default new UniversalRouter(routes, { resolveRoute })
