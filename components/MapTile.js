import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import * as L from 'mapbox.js'

import * as d3 from 'd3'

import { Map, Marker, Popup, TileLayer, GeoJson, LayersControl, ZoomControl } from 'react-leaflet';

L.mapbox.accessToken = 'pk.eyJ1IjoiZHZyZWVkNzciLCJhIjoibVMzYlVGdyJ9.dYzBhVYkCw1GRZwDxlCsng';


console.log('L', L)

export default class MapTile extends Component {
  componentDidMount() { 

    // var map = L.mapbox.map(this.refs.map, 'mapbox.streets')
    // .setView([40, -74.50], 9);

    // L.mapbox.styleLayer('mapbox://styles/dvreed77/cir1ar1fk000lbunsz4rsjc3f').addTo(map);
       
    
  }

  render() {
    var bounds = d3.geoBounds(this.props.route)
    bounds = [[bounds[0][1],bounds[0][0]], [bounds[1][1],bounds[1][0]]]

    const url = 'https://api.mapbox.com/styles/v1/dvreed77/cir1ar1fk000lbunsz4rsjc3f/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZHZyZWVkNzciLCJhIjoibVMzYlVGdyJ9.dYzBhVYkCw1GRZwDxlCsng'
    
    var s = {
      color: '#114632',
      weight: 4,
      opacity: 1
    }
    return (
        <Map 
          className="map"
          bounds={bounds} 
          zoom={13} 
          zoomControl={false} 
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
        >   
          <TileLayer url={url} />
          <GeoJson data={this.props.route} style={s} clickable={false}/>
        </Map>
    )
  }
}