import React from 'react'
import { graphql, QueryRenderer } from 'react-relay'
import {
  AppBar,
  CircularProgress,
  Toolbar,
  Typography
} from 'material-ui'

import router from '../router'
import relay from '../relay'
import history from '../history'
import CountryList from './CountryList'
import Country from './Country'
import League from './League'
import Season from './Season'

export default class App extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  unlisten: () => void

  componentDidMount() {
    this.unlisten = history.listen(this.resolveRoute.bind(this))
    this.resolveRoute(history.location)
  }

  componentWillUnmount() {
    this.unlisten()
  }

  resolveRoute(location) {
    return router.resolve(location).then(route => this.setState(route))
  }

  handleCountryClick (countryId) {
    history.push('/country/' + countryId)
  }

  renderState ({ error, props, retry }) {
    const title = (
      <AppBar position='static'>
        <Toolbar>
          <Typography type='title' color='inherit' onClick={() => history.push('/')}>
            Sphinx
          </Typography>
        </Toolbar>
      </AppBar>
    )

    if (this.state.component && props) {
      return (
        <div>
          {title}
          <this.state.component data={props} />
        </div>
      )
    } else {
      return (
        <div>
          {title}
          <CircularProgress />
        </div>
      )
    }
  }

  render () {
    return (
      <QueryRenderer
        environment={relay}
        query={this.state.query}
        variables={{
          ...this.state.params
        }}
        render={this.renderState.bind(this)}
      />
    )
  }
}
