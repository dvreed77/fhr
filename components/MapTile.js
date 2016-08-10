import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import * as L from 'mapbox.js'

import * as d3 from 'd3'

L.mapbox.accessToken = 'pk.eyJ1IjoiZHZyZWVkNzciLCJhIjoibVMzYlVGdyJ9.dYzBhVYkCw1GRZwDxlCsng';


console.log('L', L)

export default class MapTile extends Component {
  componentDidMount() { 

    var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([40, -74.50], 9);
       
    
  }

  render() {

    console.log(this.props.route)

    const {properties: {distance, name}} = this.props.route

    var divStyle = {
      width: '270px',
      height: '175px',
      float: 'left'
    };

    return (
      <div className="MapTile">
        MapTile
      </div>
    )
  }
}