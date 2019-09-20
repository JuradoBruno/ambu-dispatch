import { Component } from '@angular/core';
import * as L from 'leaflet';
import MiniMap from 'leaflet-minimap';
import 'leaflet-routing-machine';
import "../services/AnimatedMarker.js"
import route01 from "../services/route01.json"

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

  disableMissionButton = false

  redAmbuIcon = {
    icon: L.icon({
    iconSize: [90, 50],
    iconAnchor: [35, 41], // - margin-top, -margin-left
    iconUrl: 'assets/icon/ambulance-side-red.png',
    className: 'ambulance-side'
    }
  )}

  hopitalIcon = {
    icon: L.icon({
    iconSize: [80, 80],
    iconAnchor: [35, 41], // - margin-top, -margin-left
    iconUrl: 'assets/icon/hopital-rond.png'
    }
  )}
  // Define our base layers so we can reference them multiple times
  streetMaps = L.tileLayer(this.osmStreetMap, {
    detectRetina: true,
    attribution: this.osmAttribution
  });
  wMaps = L.tileLayer(this.osmWiki, {
    detectRetina: true,
    attribution: this.osmAttribution
  });

  // Marker for the parking lot at the base of Mt. Ranier trails
  redAmbu = L.marker([43.609598, 1.401405], this.redAmbuIcon);
  hopital1 = L.marker([43.609598, 1.401405], this.hopitalIcon);
  hopital2 = L.marker([43.601380, 1.433971], this.hopitalIcon);

  // Layers control object with our two base layers and the three overlay layers
  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
      'Wikimedia Maps': this.wMaps
    },
    overlays: {
      'Red Ambulance': this.redAmbu,
    }
  };

  ////// MAIN MAP OPTIONS ///////
  mainMapOptions = {
    layers: [this.streetMaps, this.hopital1, this.hopital2],
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
    // this.addRouting()
  }

  addMinimap() {
    let osm = new L.TileLayer(this.osmStreetMap)
    let miniMap = new MiniMap(osm, { minZoom: 0, maxZoom: 13, attribution: this.osmAttribution }).addTo(this.map)
  }

  addRouting() {
    let control = L.Routing.control({
      waypoints: [
          L.latLng(43.609598, 1.401405),
          L.latLng(43.601380, 1.433971)
      ],
      // router: new L.Routing.OSRMv1({
      //   serviceUrl: 'http://router.project-osrm.org/'
      // }),
    }).addTo(this.map);

    control.on('routeselected', event => {
      let coords = event.route.coordinates;
      let instr = event.route.instructions;
      this.getTheTruckMoving(coords)
    });
  }

  getTheTruckMoving(coords) {
    this.disableMissionButton = true
    coords = route01
    var line = L.polyline(coords),
    animatedMarker = L.animatedMarker(line.getLatLngs(), {
      icon: this.redAmbuIcon.icon,
      distance: 5000, // meters
      interval: 200, // milliseconds,      
    });

    this.map.addLayer(animatedMarker);
  }



}
