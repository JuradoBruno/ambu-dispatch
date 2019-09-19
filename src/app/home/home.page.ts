import { Component } from '@angular/core';
import * as L from 'leaflet';
import MiniMap from 'leaflet-minimap';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  ngOnInit() {
    this.initializeMap()
  }
  
  initializeMap() {
    let map = new L.Map('map');
		let osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		let osmAttrib='Map data &copy; OpenStreetMap contributors';
		let osm = new L.TileLayer(osmUrl, {
      minZoom: 5, 
      maxZoom: 18, 
      attribution: osmAttrib,
      useCache: true,
      crossOrigin: true
    });
		map.addLayer(osm);
    map.setView(new L.LatLng(59.92448055859924, 10.758276373601069),10);
    
    let osm2 = new L.TileLayer(osmUrl);
    new MiniMap(osm2, {minZoom: 0, maxZoom: 13, attribution: osmAttrib }).addTo(map);
  }
}
