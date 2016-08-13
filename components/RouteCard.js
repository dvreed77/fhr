import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import MapTile from '../components/MapTile'


export default class RouteCard extends Component {
  componentDidMount() { 
  }

  render() {
    const {properties: {distance, name}} = this.props.route

    var divStyle = {
      width: '270px',
      height: '250px',
      float: 'left'
    };

    return (
      <li className="route-card">
        <MapTile route={this.props.route} />
        <div className="metadata">
          <h3>
            <a href="/routes/5898772" title={name}>{name}</a>
          </h3>
          <ul className="inline-stats">
            <li>
              <strong>
                {distance.toFixed(2)}<abbr className="unit" title="miles">mi</abbr></strong>
              <div className="label">Distance</div>
            </li>
          </ul>
        </div>
      </li>
    )
  }
}