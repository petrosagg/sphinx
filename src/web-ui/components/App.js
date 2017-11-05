import React from 'react'
import { QueryRenderer } from 'react-relay'
import {
  AppBar,
  CircularProgress,
  Toolbar,
  Typography
} from 'material-ui'

import router from '../router'
import relay from '../relay'
import history from '../history'

export default class App extends React.Component {
  constructor () {
    super()
    this.state = {
      params: {},
      render: () => null
    }
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

  renderState ({ props }) {
    return <div>
      <AppBar position='static'>
        <Toolbar>
          <Typography type='title' color='inherit' onClick={() => history.push('/')}>
            Sphinx
          </Typography>
        </Toolbar>
      </AppBar>
      {props ? this.state.render(props) : <CircularProgress />}
    </div>
  }

  render () {
    const s = this.state
    return <QueryRenderer environment={relay} query={s.query} variables={s.params} render={opts => this.renderState(opts)} />
  }
}
