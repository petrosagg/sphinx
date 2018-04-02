import React from 'react'
import { QueryRenderer } from 'react-relay'
import {
  AppBar,
  LinearProgress,
  Toolbar,
  Typography
} from 'material-ui'
import { withStyles } from 'material-ui/styles'

import router from '../router'
import relay from '../relay'
import history from '../history'

const styles = theme => ({
  title: {
    color: 'white',
    textDecoration: 'none'
  }
})

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      params: {},
      render: () => null
    }
  }

  unlisten () {}

  componentDidMount () {
    this.unlisten = history.listen(l => this.resolveRoute(l))
    this.resolveRoute(history.location)
  }

  componentWillUnmount () {
    this.unlisten()
  }

  resolveRoute (location) {
    return router.resolve(location).then(route => this.setState(route))
  }

  renderState ({ props }) {
    return <div>
      <AppBar position='static'>
        <Toolbar>
          <a className={this.props.classes.title} href='#'>
            <Typography variant='title' color='inherit' onClick={() => history.push('/')}>
              Sphinx
            </Typography>
          </a>
        </Toolbar>
      </AppBar>
      {props ? this.state.render(props) : <LinearProgress mode='query' color='secondary' />}
    </div>
  }

  render () {
    const s = this.state
    return <QueryRenderer environment={relay} query={s.query} variables={s.params} render={opts => this.renderState(opts)} />
  }
}

export default withStyles(styles)(App)
