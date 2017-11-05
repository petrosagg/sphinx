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
        country(id: $id) {
          ...Country_country
        }
      }
    `,
    render: props => <Country country={props.country} />
  },
  {
    path: '/league/:id',
    query: graphql`
      query router_LeagueQuery($id: String) {
        league(id: $id) {
          ...League_league
        }
      }
    `,
    render: props => <League league={props.league} />
  },
  {
    path: '/season/:id',
    query: graphql`
      query router_SeasonQuery($id: String) {
        season(id: $id) {
          ...Season_season
        }
      }
    `,
    render: props => <Season season={props.season} />
  }
]

const resolveRoute = ({ route, next }, params) => route.render ? { ...route, params } : next()

export default new UniversalRouter(routes, { resolveRoute })
