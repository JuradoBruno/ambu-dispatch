import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet'

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.scss'],
})
export class MainMapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.initializeMap()
  }
  initializeMap() {
    const myfrugalmap = L.map('frugalmap').setView([50.6311634, 3.0599573], 12);
     L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Frugal Map'
    }).addTo(myfrugalmap);
  }

}
