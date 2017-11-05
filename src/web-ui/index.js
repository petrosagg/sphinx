import React from 'react'
import ReactDOM from 'react-dom'
import WebFont from 'webfontloader'

import App from './components/App'

document.body.style.padding = 0
document.body.style.margin = 0
document.body.style.fontFamily = 'sans-serif'

WebFont.load({
  google: {
    families: [ 'Roboto', 'Roboto Mono', 'Material Icons' ]
  }
})

const root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(<App />, root)
