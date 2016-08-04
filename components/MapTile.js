import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import mapboxgl from 'mapbox-gl'
import * as d3 from 'd3'
mapboxgl.accessToken = 'pk.eyJ1IjoiZHZyZWVkNzciLCJhIjoibVMzYlVGdyJ9.dYzBhVYkCw1GRZwDxlCsng';


export default class MapTile extends Component {
  componentDidMount() {    
    var map = new mapboxgl.Map({
        container: this.refs.map,
        style: 'mapbox://styles/dvreed77/cir1ar1fk000lbunsz4rsjc3f',
        center: {lng: -71.12292253946296, lat: 42.31995258431931},
        zoom: 12.3,
        scrollZoom: false
    });

    var data = this.props.route

    var bounds = d3.geoBounds(data)

    map.fitBounds(bounds, {padding: 10});

    var sourceObj = new mapboxgl.GeoJSONSource({
      "type": "geojson",
       data: data
    });

    var start = new mapboxgl.GeoJSONSource({
      "type": "geojson",
       data: {geometry:{coordinates:data.geometry.coordinates[0], type: 'Point'}, type:'Feature'}
    });

    var end = new mapboxgl.GeoJSONSource({
      "type": "geojson",
       data: {geometry:{coordinates:data.geometry.coordinates.pop(), type: 'Point'}, type:'Feature'}
    });

      map.on('load', function () {
          map.addSource('route', sourceObj);
          map.addSource('start', start);
          map.addSource('end', end);

          map.addLayer({
            "id": "route",
            "type": "line",
            "source": "route",
            "layout": {
              "line-join": "round",
              "line-cap": "round"
            },
            "paint": {
              "line-color": "#114632",
              "line-width": 3
            }
          });

          map.addLayer({
            "id": "start",
            "type": "circle",
            "source": "start",
            "paint": {
              "circle-radius": 5,
              "circle-color": "#114632",
            }
          });

          map.addLayer({
            "id": "end",
            "type": "circle",
            "source": "end",
            "paint": {
              "circle-radius": 5,
              "circle-color": "#114632",
            }
          });
      });
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
        <div ref='map' style={divStyle}></div>
        <div className="metadata">
          <h3>
            <a title="{name}">{name}</a>
          </h3>
          <ul className="inline-stats">
            <li>
              <strong>
                {distance.toFixed(2)}<abbr className="unit" title="miles">mi</abbr></strong>
              <div className="label">Distance</div>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}