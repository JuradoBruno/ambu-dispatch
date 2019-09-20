import { Component } from '@angular/core';
import * as L from 'leaflet';
import MiniMap from 'leaflet-minimap';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  map
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


  // greenIcon = L.icon({
  //   iconUrl: 'leaf-green.png',
  //   shadowUrl: 'leaf-shadow.png',

  //   iconSize:     [38, 95], // size of the icon
  //   shadowSize:   [50, 64], // size of the shadow
  //   iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  //   shadowAnchor: [4, 62],  // the same for the shadow
  //   popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  // });

  // Leaflet Marker
  greenLeaf = L.marker([46.8523, -121.7603], {
    icon: L.icon({
      iconUrl: 'assets/icon/leaf-green.png',
      shadowUrl: 'assets/icon/leaf-shadow.png',

      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    })
  });

  // Marker for the parking lot at the base of Mt. Ranier trails
  icon = L.marker([43.609598, 1.401405], {
    icon: L.icon({
      iconSize: [90, 50],
      iconAnchor: [35, 41], // - margin-top, -margin-left
      iconUrl: 'assets/icon/ambulance-side-red.png',
      className: 'ambulance-side'
    })
  });

  // Path from icon to summit - most points omitted from this example for brevity

  // Layers control object with our two base layers and the three overlay layers
  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
      'Wikimedia Maps': this.wMaps
    },
    overlays: {
      'Mt. Rainier icon Start': this.icon,
    }
  };

  ////// MAIN MAP OPTIONS ///////
  mainMapOptions = {
    layers: [this.streetMaps, this.icon, this.greenLeaf],
    zoom: 16,
    center: L.latLng([43.609598, 1.401405])
  };
  layersControlOptions: L.ControlOptions = { position: 'bottomright' };


  constructor() { }

  ngOnInit() {
  }

  onMapAlmostReady(map: L.Map) {
    this.map = map
    setTimeout(() => {
      map.invalidateSize()      
      this.onMapReady()
    }, 0)
  }

  onMapReady() {
    this.addMinimap()    
  }

  addMinimap() {
    let osm = new L.TileLayer(this.osmStreetMap)
    let miniMap = new MiniMap(osm, { minZoom: 0, maxZoom: 13, attribution: this.osmAttribution }).addTo(this.map)
  }
}
