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
    component: CountryList,
  },
  {
    path: '/country/:id',
    query: graphql`
      query router_CountryQuery($id: String) {
          ...Country
      }
    `,
    component: Country
  },
  {
    path: '/league/:id',
    query: graphql`
      query router_LeagueQuery($id: String) {
        ...League
      }
    `,
    component: League
  },
  {
    path: '/season/:id',
    query: graphql`
      query router_SeasonQuery($id: String) {
        ...Season
      }
    `,
    component: Season
  }
]

const resolveRoute = ({ route, next }, params) => route.component ? { ...route, params } : next()

export default new UniversalRouter(routes, { resolveRoute })
