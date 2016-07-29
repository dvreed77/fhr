import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import mapboxgl from 'mapbox-gl'
mapboxgl.accessToken = 'pk.eyJ1IjoiZHZyZWVkNzciLCJhIjoibVMzYlVGdyJ9.dYzBhVYkCw1GRZwDxlCsng';



export default class MapTile extends Component {
  componentDidMount() {
    console.log('MOUNTED', this.refs.map)

    mapboxgl.accessToken = 'pk.eyJ1IjoiZHZyZWVkNzciLCJhIjoibVMzYlVGdyJ9.dYzBhVYkCw1GRZwDxlCsng';
    var map = new mapboxgl.Map({
        container: this.refs.map,
        style: 'mapbox://styles/dvreed77/cir1ar1fk000lbunsz4rsjc3f',
        center: {lng: -71.12292253946296, lat: 42.31995258431931},
        zoom: 12.3
    });

    map.on('moveend', function (e) {

      console.log(e, map.getCenter(), map.getZoom())
      // var features = map.queryRenderedFeatures(e.point);
      // document.getElementById('features').innerHTML = JSON.stringify(features, null, 2);
    });

    fetch('./routes.json')
    .then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      console.log(json, response)

      var data = json[4]
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

      console.log(sourceObj.extent)

      map.on('load', function () {
          map.addSource('dave', sourceObj); // add

          map.addSource('start', start); // add

          map.addSource('end', end); // add

          map.addLayer({
              "id": "dave",
              "type": "line",
              "source": "dave",
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
    })
    // var map = new mapboxgl.Map({
    //   container: this.refs.map,
    //   style: 'mapbox://styles/mapbox/streets-v9'
    // });
    // this.map = L.mapbox.map(this.refs.map.getDOMNode(), MAP, {
    //   zoomControl: false
    // });
    // if (this.state.nodes) this.map.featureLayer.setGeoJSON(this.state.nodes);
  }

  render() {

    var divStyle = {
      width: '300px'
    };

    return (
      <div style={divStyle} className="MapTile">
        <div ref='map'></div>
        This is a maptile
      </div>
    )
  }
}

// User.propTypes = {
//   user: PropTypes.shape({
//     login: PropTypes.string.isRequired,
//     avatarUrl: PropTypes.string.isRequired,
//     name: PropTypes.string
//   }).isRequired
// }



// var React = require('react/addons'),
//   Reflux = require('reflux'),
//   Router = require('react-router'),
//   { NotFoundRoute, Navigation, State, Link, Route, RouteHandler, DefaultRoute } = Router,
//   osmAuth = require('osm-auth'),
//   haversine = require('haversine'),
//   xhr = require('xhr'),
//   currency = require('./currency_symbols.json'),
//   qs = require('querystring');

// window.React = React;

// // Constants for API endpoints
// const API06 = 'http://api.openstreetmap.org/api/0.6/',
//   OVERPASS = 'http://overpass-api.de/api/interpreter';

// // Constants for our OAuth connection to OpenStreetMap.
// const OAUTH_CONSUMER_KEY = 'VTdXpqeoRiraqICAoLN3MkPghHR5nEG8cKfwPUdw',
//   OAUTH_SECRET = 'ugrQJAmn1zgdn73rn9tKCRl6JQHaZkcen2z3JpAb';

// // # Configuration
// // This is used to show certain nodes in the list: otherwise the ones
// // we're looking for would be crowded out by telephone poles etc.
// const KEYPAIR = { k: 'amenity', v: 'cafe' },
//   TAG = 'cost:coffee',
// // The version string is added to changesets to let OSM know which
// // editor software is responsible for which changes.
//   VERSION = 'COFFEEDEX 2002',
//   MBX = 'pk.eyJ1IjoidG1jdyIsImEiOiIzczJRVGdRIn0.DKkDbTPnNUgHqTDBg7_zRQ',
//   MAP = 'tmcw.kbh273ee',
//   PIN = 'pin-l-cafe',
//   LOC = 'pin-s';

// L.mapbox.accessToken = MBX;

// // # Parsing & Producing XML
// var a = (nl) => Array.prototype.slice.call(nl),
//   attr = (n, k) => n.getAttribute(k),
//   serializer = new XMLSerializer();
// // Given an XML DOM in OSM format and an object of the form
// //
// //     { k, v }
// //
// // Find all nodes with that key combination and return them
// // in the form
// //
// //     { xml: Node, tags: {}, id: 'osm-id' }
// var parser = (xml, kv) =>
//   a(xml.getElementsByTagName('node')).map(node =>
//     a(node.getElementsByTagName('tag')).reduce((memo, tag) => {
//       memo.tags[attr(tag, 'k')] = attr(tag, 'v'); return memo;
//     }, {
//       xml: node, tags: {}, id: attr(node, 'id'),
//       location: {
//         latitude: parseFloat(attr(node, 'lat')),
//         longitude: parseFloat(attr(node, 'lon'))
//       }
//     }))
//     .filter(node => node.tags[kv.k] === kv.v);
// var serialize = (xml) => serializer.serializeToString(xml)
//   .replace('xmlns="http://www.w3.org/1999/xhtml"', '');
// // Since we're building XML the hacky way by formatting strings,
// // we'll need to escape strings so that places like "Charlie's Shop"
// // don't make invalid XML.
// var escape = _ => _.replace(/&/g, '&amp;')
//   .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// // Generate the XML payload necessary to open a new changeset in OSM
// var changesetCreate = (comment) => `<osm><changeset>
//     <tag k="created_by" v="${VERSION}" />
//     <tag k="comment" v="${escape(comment)}" />
//   </changeset></osm>`;
// // After the OSM changeset is opened, we need to send the changes:
// // this generates the necessary XML to add or update a specific
// // tag on a single node.
// var changesetChange = (node, tag, id) => {
//   a(node.getElementsByTagName('tag'))
//     .filter(tagElem => tagElem.getAttribute('k') === tag.k)
//     .forEach(tagElem =>  node.removeChild(tagElem));
//   node.setAttribute('changeset', id);
//   var newTag = node.appendChild(document.createElement('tag'));
//   newTag.setAttribute('k', tag.k); newTag.setAttribute('v', tag.v);
//   return `<osmChange version="0.3" generator="${VERSION}">
//     <modify>${serialize(node)}</modify>
//     </osmChange>`;
// };
// var sortDistance = (location) =>
//   (a, b) => haversine(location, a.location) - haversine(location, b.location);
// var queryOverpass = (center, kv, callback) => {
//   const RADIUS = 0.1;
//   var bbox = [
//     center.latitude - RADIUS, center.longitude - RADIUS,
//     center.latitude + RADIUS, center.longitude + RADIUS
//   ].join(',');
//   var query = `[out:xml][timeout:25];
//   (node["${kv.k}"="${kv.v}"](${bbox});); out body; >; out skel qt;`;
//   xhr({ uri: OVERPASS, method: 'POST', body: query }, callback);
// };
// var queryOverpassAll = (callback) => {
//   var query = `[out:json][timeout:1000];(node["cost:coffee"];);out body; >; out skel qt;`;
//   xhr({ uri: OVERPASS, method: 'POST', body: query }, callback);
// };

// // # Stores
// var locationStore = Reflux.createStore({
//   location: { latitude: 0, longitude: 0 },
//   getInitialState() { return this.location; },
//   init() {
//     this.watcher = navigator.geolocation.watchPosition(res => {
//       if (haversine(this.location, res.coords) > 10) {
//         this.trigger(res.coords);
//       }
//       this.location = res.coords;
//     });
//   }
// });

// // The worldNode store stores only data for the WorldMap component:
// // instead of loading a list with [Overpass API](http://wiki.openstreetmap.org/wiki/Overpass_API)
// // and detail with API 0.6, this simply hits Overpass, and uses the easy-to-parse JSON output
// // instead of XML.
// //
// // We then transform Overpass's JSON encoding into [GeoJSON](http://geojson.org/)
// // so Mapbox.js can display the points.
// var worldNodeLoad = Reflux.createAction();
// var worldNodeStore = Reflux.createStore({
//   nodes: null,
//   getInitialState() { return this.nodes; },
//   init() { this.listenTo(worldNodeLoad, this.load); },
//   load() {
//     queryOverpassAll((err, resp, json) => {
//       if (err) return console.error(err);
//       this.nodes = {
//         type: 'FeatureCollection',
//         features: JSON.parse(json).elements.map((elem) => {
//           elem.tags.title = elem.tags.name || '';
//           elem.tags.description = elem.tags[TAG];
//           elem.tags['marker-symbol'] = 'cafe';
//           elem.tags['marker-color'] = '#5a3410';
//           return {
//             type: 'Feature',
//             properties: elem.tags,
//             geometry: { type: 'Point', coordinates: [elem.lon, elem.lat]  }
//           };
//         })
//       };
//       this.trigger(this.nodes);
//     });
//   }
// });

// // Here's where we store fully-formed OSM Nodes that correspond to matches.
// // These are listed with Overpass and then loaded in full with OSM API.
// // This two-step process imitates the ability to filter the OSM API - without
// // it, we'd have some very slow calls to the `/map/` endpoint, instead of
// // fast calls to the `/nodes` endpoint.
// var nodeLoad = Reflux.createAction();
// var nodeSave = Reflux.createAction();
// var nodeStore = Reflux.createStore({
//   nodes: {},
//   getInitialState() { return this.nodes; },
//   init() {
//     this.listenTo(nodeLoad, this.load);
//     this.listenTo(locationStore, this.load);
//     this.listenTo(nodeSave, this.save);
//   },
//   load(center) {
//     queryOverpass(center, KEYPAIR, (err, resp, map) => {
//       if (err) return console.error(err);
//       this.loadNodes(parser(resp.responseXML, KEYPAIR)
//         .sort(sortDistance(center))
//         .slice(0, 50)
//         .map(n => n.id));
//     });
//   },
//   loadNodes(ids) {
//     ids = ids.filter(id => !this.nodes[id]);
//     if (!ids.length) return this.trigger(this.nodes);
//     xhr({ uri: `${API06}nodes/?nodes=${ids.join(',')}`, method: 'GET' }, (err, resp, body) => {
//       if (err) return console.error(err);
//       parser(resp.responseXML, KEYPAIR).forEach(node => {
//         if (!this.nodes[node.id]) this.nodes[node.id] = node;
//       });
//       this.trigger(this.nodes);
//     });
//   },
//   save(res, price, currency) {
//     const XMLHEADER = { header: { 'Content-Type': 'text/xml' } };
//     var xml = res.xml;
//     var tag = { k: TAG, v: currency + price };
//     var comment = `Updating coffee price to ${currency} ${price} for ${res.tags.name}`;
//     auth.xhr({ method: 'PUT', prefix: false, options: XMLHEADER,
//       content: changesetCreate(comment),
//       path: `${API06}changeset/create`
//     }, (err, id) => {
//       if (err) return console.error(err);
//       auth.xhr({ method: 'POST', prefix: false, options: XMLHEADER,
//         content: changesetChange(xml, tag, id),
//         path: `${API06}changeset/${id}/upload`,
//       }, (err, res) => {
//         auth.xhr({ method: 'PUT', prefix: false,
//           path: `${API06}changeset/${id}/close`
//         }, (err, id) => {
//             if (err) console.error(err);
//             router.transitionTo('/success');
//         });
//       });
//     });
//   }
// });

// // osm-auth does the hard work of managing user authentication with
// // OpenStreetMap via the OAuth protocol.
// var auth = osmAuth({
//   oauth_consumer_key: OAUTH_CONSUMER_KEY,
//   oauth_secret: OAUTH_SECRET,
//   auto: false,
//   landing: 'index.html',
//   singlepage: true
// });

// // Here we store the user's logged-in / logged-out status so we can show
// // the authentication view instead of a list as an initial pageview.
// var userLogin = Reflux.createAction();
// var userStore = Reflux.createStore({
//   user: null,
//   init() {
//     this.user = auth.authenticated();
//     this.listenTo(userLogin, this.login);
//   },
//   getInitialState() {
//     return this.user;
//   },
//   login() {
//     auth.authenticate((err, details) => {
//       this.user = auth.authenticated();
//       this.trigger(this.user);
//     });
//   }
// });

// // # Components

// // A simple shout-out and log-in button that shoots a user into the OSM
// // oauth flow.
// var LogIn = React.createClass({
//   render() {
//     /* jshint ignore:start */
//     return (<div className='pad2'>
//         <div className='pad1 space-bottom1'>
//           COFFEEDEX is built on OpenStreetMap and requires an OpenStreetMap account.
//         </div>
//         <button
//           onClick={userLogin}
//           className='button col12 fill-green icon account'>Log in to OpenStreetMap</button>
//       </div>
//     );
//     /* jshint ignore:end */
//   }
// });

// // A simple wrapper for a call to the [Mapbox Static Map API](https://www.mapbox.com/developers/api/static/)
// // that we use for editing pages: this gives a basic idea of where the coffee
// // shop is as well as a marker for your location. Helpful when there's
// // a Starbucks on every corner of an intersection.
// var StaticMap = React.createClass({
//   render() {
//     return (
//       /* jshint ignore:start */
//       <img src={`https://api.tiles.mapbox.com/v4/${MAP}/` +
//         `${PIN}(${this.props.location.longitude},${this.props.location.latitude}),` +
//         (this.props.self ? `${LOC}(${this.props.self.longitude},${this.props.self.latitude})` : '') +
//         `/${this.props.location.longitude},${this.props.location.latitude}` +
//         `,14/300x200@2x.png?access_token=${MBX}`} />
//       /* jshint ignore:end */
//     );
//   }
// });

// var Page = React.createClass({
//   render() {
//     return (
//       /* jshint ignore:start */
//       <div className='margin3 col6'>
//         <div className='col12'>
//           <RouteHandler/>
//         </div>
//       </div>
//       /* jshint ignore:end */
//     );
//   }
// });

// var values = obj => Object.keys(obj).map(key => obj[key]);

// // A list of potential nodes for viewing and editing.
// var List = React.createClass({
// // We use Reflux's `.connect` method to listen for changes in stores
// // and automatically call setState to use their data here.
//   mixins: [
//     Reflux.connect(nodeStore, 'nodes'),
//     Reflux.connect(locationStore, 'location'),
//     Reflux.connect(userStore, 'user')],
//   /* jshint ignore:start */
//   render() {
//     return (
//     <div>
//       <div className='clearfix col12'>
//         <div className='pad2 clearfix'>
//           <div className='col4'>
//             <img width={300/2} height={230/2}
//               className='inline' src='assets/logo_inverted.png' />
//           </div>
//           <div className='col8 pad2y pad1x'>
//             <h3>COFFEEDEX</h3>
//             <p className='italic'>how much does a cup of coffee for here cost, everywhere?</p>
//           </div>
//         </div>
//       </div>
//       {this.state.user ?
//         <div className='pad2'>
//           {!values(this.state.nodes).length && <div className='pad4 center'>
//             Loading...
//           </div>}
//           {values(this.state.nodes)
//             .sort(sortDistance(this.state.location))
//             .map(res => <Result key={res.id} res={res} />)}
//         </div> :
//       <LogIn />}
//       <div className='center dark space-bottom1'>
//         <div className='pill space-top1'>
//           <Link
//             className='button stroke quiet icon globe'
//             to='world_map'>World Map</Link>
//           <Link
//             className='button stroke quiet'
//             to='help'>Help</Link>
//         </div>
//       </div>
//     </div>);
//   }
//   /* jshint ignore:end */
// });

// // A single list item
// var Result = React.createClass({
//   render() {
//     /* jshint ignore:start */
//     return <Link to='editor'
//       params={{ osmId: this.props.res.id }}
//       className='pad1 col12 clearfix fill-coffee space-bottom1'>
//       <div className='price-tag round'>
//         {this.props.res.tags[TAG] ?
//           this.props.res.tags[TAG] : <span className='icon pencil'></span>}
//       </div>
//       <strong>{this.props.res.tags.name}</strong>
//     </Link>;
//     /* jshint ignore:end */
//   }
// });

// var parseCurrency = str => {
//   var number = str.match(/[\d\.]+/), currency = str.match(/[^\d\.]+/);
//   return {
//     currency: currency || '$',
//     price: parseFloat((number && number[0]) || 0)
//   };
// };

// // This view is shown briefly after a user completes an edit. The user
// // can either click/tap to go back to the list, or it'll do that automatically
// // in 1 second.
// var Success = React.createClass({
//   mixins: [Navigation],
//   componentDidMount() {
//     setTimeout(() => {
//       if (this.isMounted()) {
//         this.transitionTo('list');
//       }
//     }, 1000);
//   },
//   /* jshint ignore:start */
//   render() {
//     return <Link to='list' className='col12 center pad4'>
//       <h2><span className='big icon check'></span> Saved!</h2>
//     </Link>;
//   }
//   /* jshint ignore:end */
// });

// // The help page. Doesn't have any JavaScript functionality of its own -
// // this is static content.
// var Help = React.createClass({
//   /* jshint ignore:start */
//   render() {
//     return <div>
//       <Link
//         to='list'
//         className='home icon button fill-darken2 col12'>home</Link>
//       <div className='pad1y'>
//         <div className='round fill-lighten0 pad2 dark'>
//           <p><strong>COFFEEDEX</strong> is a community project that aims to track the price of house coffee everywhere.</p>
//           <p>The data is stored in <a href='http://osm.org/'>OpenStreetMap</a>, a free and open source map of the world, as tags on existing coffeehops. There are 150,000+.</p>
//           <p>Maps in this application are &copy; <a href='http://mapbox.com/'>Mapbox</a>.</p>
//           <p>COFFEEDEX data stored in OpenStreetMap is <a href='http://www.openstreetmap.org/copyright'>available under the ODbL license.</a></p>
//           <p>This is also an open source project. You can view the source code, clone it, fork it, and make new things with it as inspiration or raw parts.</p>
//           <a className='button stroke icon github col12 space-bottom1' href='http://github.com/tmcw/coffeedex'>COFFEEDEX on GitHub</a>
//           <p><span className='icon mobile'></span> COFFEEDEX also works great on phones! Try it on your phone and add it to your iPhone home screen - it'll look even prettier.</p>
//           <h2>FAQ</h2>
//           <ul>
//             <li><strong>Which coffee?</strong> This site tracks the price of <em>house coffee</em> for here. In many cases, that means a 12oz drip, but if all coffees are pour-overs or your country uses different standard size, the overriding rule is cheapest-here.</li>
//           </ul>
//         </div>
//       </div>
//     </div>;
//   }
//   /* jshint ignore:end */
// });

// // The WorldMap page. This uses the worldNodeLoad to show all tagged
// // nodes worldwide on an interactive Mapbox map.
// var WorldMap = React.createClass({
//   mixins: [Navigation, Reflux.connect(worldNodeStore, 'nodes')],
//   statics: {
//     willTransitionTo(transition, params) {
//       worldNodeLoad();
//     }
//   },
//   /* jshint ignore:start */
//   componentDidMount() {
//     this.map = L.mapbox.map(this.refs.map.getDOMNode(), MAP, {
//       zoomControl: false
//     });
//     if (this.state.nodes) this.map.featureLayer.setGeoJSON(this.state.nodes);
//   },
//   componentDidUpdate() {
//     if (this.state.nodes) this.map.featureLayer.setGeoJSON(this.state.nodes);
//   },
//   render() {
//     return <div>
//       <div ref='map' className='pin-top pin-bottom' id='map'></div>
//       {this.state.nodes &&
//       <div
//         className='pin-bottom fill-navy pad0 center'>
//         <strong>{this.state.nodes.features.length}</strong> prices worldwide
//       </div>}
//       <Link
//         to='list'
//         className='home icon button fill-navy dark pin-top unround col12'>home</Link>
//     </div>;
//   }
//   /* jshint ignore:end */
// });

// // The editor. This allows users to view and edit tags on single result items.
// var Editor = React.createClass({
//   mixins: [
//     Reflux.listenTo(nodeStore, 'onNodeLoad', 'onNodeLoad'),
//     Reflux.connect(locationStore, 'location'),
//     State, React.addons.LinkedStateMixin],
//   onNodeLoad(nodes) {
//     var node = nodes[this.getParams().osmId];
//     if (node) {
//       if (node.tags[TAG]) {
//         var currency = parseCurrency(node.tags[TAG]);
//         this.setState({
//           currency: currency.currency,
//           price: currency.price,
//           node: node
//         });
//       } else {
//         this.setState({ node: node });
//       }
//     }
//   },
//   getInitialState() {
//     return {
//       currency: '$',
//       price: 0
//     };
//   },
//   // Before this view is displayed, we make sure that the node it'll
//   // show will be loaded soon.
//   statics: {
//     willTransitionTo(transition, params) {
//       nodeStore.loadNodes([params.osmId]);
//     },
//   },
//   save(e) {
//     e.preventDefault();
//     var node = this.state.node;
//     nodeSave(node, this.state.price, this.state.currency);
//   },
//   render() {
//     var node = this.state.node;
//     /* jshint ignore:start */
//     if (!node) return <div className='pad4 center'>
//       Loading...
//     </div>;
//     return <div className='col12'>
//       <Link
//         to='list'
//         className='home icon button fill-darken0 unround col12'>home</Link>
//       <StaticMap location={node.location} self={this.state.location} />
//       <div className='pad1 col12 clearfix'>
//         <div className='col12'>
//           <div className='center'>
//             how much for a cup of joe at
//           </div>
//           <h1 className='center'>
//             {node.tags.name}
//           </h1>
//         </div>
//         <div className='limit-mobile'>
//           <div className='col12 clearfix space-bottom1'>
//             <select
//               valueLink={this.linkState('currency')}
//               className='coffee-select'>
//               {currency.map(c => <option key={c[0]} value={c[0]}>{c[1]}</option>)}
//             </select>
//             <input valueLink={this.linkState('price')}
//               className='coffee-input' type='number' />
//           </div>
//           <a href='#'
//             onClick={this.save}
//           className='fill-darken1 button col12 icon plus pad1 unround'>Save</a>
//         </div>
//       </div>
//     </div>;
//     /* jshint ignore:end */
//   }
// });

// // Our router. This manages what URLs mean and where Links can go.
// var routes = (
//   /* jshint ignore:start */
//   <Route handler={Page} path='/'>
//     <DefaultRoute name='list' handler={List} />
//     <Route name='world_map' path='/world_map' handler={WorldMap} />
//     <Route name='success' path='/success' handler={Success} />
//     <Route name='help' path='/help' handler={Help} />
//     <Route name='editor' path='/edit/:osmId' handler={Editor} />
//   </Route>
//   /* jshint ignore:end */
// );

// var router = Router.create({ routes });

// // This is a little dirty: the router will rewrite paths it doesn't know,
// // including the path we desperately need to complete the OAuth dance.
// // So before booting it up, we notice if we need to bootstrap an oauth_token,
// // and if so, we do that before starting the application.
// if (location.search && !auth.authenticated()) {
//   var oauth_token = qs.parse(location.search.replace('?', '')).oauth_token;
//   auth.bootstrapToken(oauth_token, (err, res) => {
//     userStore.user = true;
//     userStore.trigger(userStore.user);
//     router.run(Handler => {
//       /* jshint ignore:start */
//       React.render(<Handler/>, document.body);
//       /* jshint ignore:end */
//     });
//   });
// } else {
//   router.run(Handler => {
//     /* jshint ignore:start */
//     React.render(<Handler/>, document.body);
//     /* jshint ignore:end */
//   });
// }