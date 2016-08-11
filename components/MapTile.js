import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import * as L from 'mapbox.js'

import * as d3 from 'd3'

import { Map, Marker, Popup, TileLayer, GeoJson } from 'react-leaflet';

L.mapbox.accessToken = 'pk.eyJ1IjoiZHZyZWVkNzciLCJhIjoibVMzYlVGdyJ9.dYzBhVYkCw1GRZwDxlCsng';


console.log('L', L)

export default class MapTile extends Component {
  componentDidMount() { 

    // var map = L.mapbox.map(this.refs.map, 'mapbox.streets')
    // .setView([40, -74.50], 9);

    // L.mapbox.styleLayer('mapbox://styles/dvreed77/cir1ar1fk000lbunsz4rsjc3f').addTo(map);
       
    
  }

  render() {

    const position = [51.505, -0.09];

    var divStyle = {
      width: '270px',
      height: '175px',
      float: 'left'
    };

    const url = 'https://api.mapbox.com/styles/v1/dvreed77/cir1ar1fk000lbunsz4rsjc3f/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZHZyZWVkNzciLCJhIjoibVMzYlVGdyJ9.dYzBhVYkCw1GRZwDxlCsng'
    
    const map = (
    <Map style={divStyle} center={position} zoom={13}>
      <TileLayer url={url} />
      <GeoJson data={this.props.route} />
    </Map>
    );

    console.log(this.props.route)

    const {properties: {distance, name}} = this.props.route

    var divStyle = {
      width: '270px',
      height: '175px',
      float: 'left'
    };

    return (
      <div style={divStyle}>{map}</div>
    )
  }
}