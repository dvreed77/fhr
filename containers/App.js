import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import RouteCard from '../components/RouteCard'
import _ from 'lodash'
// import { resetErrorMessage } from '../actions'


// console.log(_)

import { loadRoutes } from '../actions'

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.loadRoutes()
  }

  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </p>
    )
  }

  render() {
    const { children, inputValue, routes } = this.props
    if (!Object.keys(routes).length) {
      return <h1><i>Loading routes...</i></h1>
    }
    return (
      <ul className="routes-list">
        {_.values(routes).map(function(route, i) {
          return <RouteCard key={i} route={route} />
        })}
      </ul>
    )
  }
}

App.propTypes = {
  // Injected by React Redux
  errorMessage: PropTypes.string,
  loadRoutes: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  // Injected by React Router
  children: PropTypes.node
}

function mapStateToProps(state, ownProps) {
  // console.log('STATE', state)
  const {
    entities: { routes }
  } = state

  return {
    routes,
    errorMessage: state.errorMessage,
    inputValue: ownProps.location.pathname.substring(1)
  }
}

export default connect(mapStateToProps, {
  loadRoutes
})(App)
