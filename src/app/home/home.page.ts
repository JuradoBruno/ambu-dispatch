import { Component } from '@angular/core';
import * as L from 'leaflet';
import MiniMap from 'leaflet-minimap';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  osmStreetMap = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  osmWiki = 'http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
  osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  // Define our base layers so we can reference them multiple times
  streetMaps = L.tileLayer(this.osmStreetMap, {
    detectRetina: true,
    attribution: this.osmAttribution
  });
  wMaps = L.tileLayer(this.osmWiki, {
    detectRetina: true,
    attribution: this.osmAttribution
  });

  // Marker for the top of Mt. Ranier
  summit = L.marker([ 46.8523, -121.7603 ], {
    icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 41 ],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    })
  });

  // Marker for the parking lot at the base of Mt. Ranier trails
  paradise = L.marker([ 46.78465227596462,-121.74141269177198 ], {
    icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 41 ],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    })
  });

  // Path from paradise to summit - most points omitted from this example for brevity
  route = L.polyline([[ 46.78465227596462,-121.74141269177198 ],
    [ 46.80047278292477, -121.73470708541572 ],
    [ 46.815471360459924, -121.72521826811135 ]]);

  // Layers control object with our two base layers and the three overlay layers
  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
      'Wikimedia Maps': this.wMaps
    },
    overlays: {
      'Mt. Rainier Summit': this.summit,
      'Mt. Rainier Paradise Start': this.paradise,
      'Mt. Rainier Climb Route': this.route
    }
  };

  ////// MAIN MAP OPTIONS ///////
  mainMapOptions = {
    layers: [ this.streetMaps, this.route, this.summit, this.paradise ],
    zoom: 7,
    center: L.latLng([ 46.879966, -121.726909 ])
  };
  layersControlOptions: L.ControlOptions = { position: 'bottomright' };

  constructor() { }

  ngOnInit() {
  }

  onMapReady(map: L.Map) {
    
    setTimeout(() => {
      map.invalidateSize()
      let osm = new L.TileLayer(this.osmStreetMap)
      let miniMap = new MiniMap(osm, { minZoom: 0, maxZoom: 13, attribution: this.osmAttribution }).addTo(map)
    }, 0);
  }
}
