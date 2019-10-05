import { Component } from '@angular/core';
import * as L from 'leaflet';
import MiniMap from 'leaflet-minimap';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine-here';
import '../services/moving-marker.service';
// import "../services/AnimatedMarker.js"
import route01 from "../services/route01.json"
import route01Duration from "../services/route01-duration.json"
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { SubSink } from 'subsink';
import { IStoreState } from '../core/stores/store-state.interface';
import { ComponentsStateStore, ComponentStateActions } from '../core/stores/components-state.store';
import { Observable } from 'rxjs';
import { UserStore } from '../core/stores/user.store';
import { BuildingsStore } from '../core/stores/buildings.store';
import { Building } from '../models/Buildings.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  subs = new SubSink()

  map
  miniMap
  osmStreetMap = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  osmWiki = 'http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
  osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  movingMarkers = []
  disableMissionButton = false
  firstMissionstarted = false
  missionIsRunning = false
  

  redAmbuIcon = {
    icon: L.icon({
      iconSize: [75, 40],
      iconAnchor: [35, 41], // - margin-top, -margin-left
      iconUrl: 'assets/icon/ambulance-side-red.png',
      className: 'ambulance-side'
    }
    )
  }

  hopitalIcon = {
    icon: L.icon({
      iconSize: [73, 73],
      iconAnchor: [35, 41], // - margin-top, -margin-left
      iconUrl: 'assets/icon/hopital-rond-strong.png'
    }
    )
  }
  // Define our base layers so we can reference them multiple times
  streetMaps = L.tileLayer(this.osmStreetMap, {
    detectRetina: true,
  });
  wMaps = L.tileLayer(this.osmWiki, {
    detectRetina: true,
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
  
  coinMoney: any;
  cashMoney: any;
  showConstructionTab: boolean;
  buildings: Building[]

  constructor( 
    private router: Router,
    private authService: AuthService,
    private userStore: UserStore,
    private buildingStore: BuildingsStore,
    private componentStateStore: ComponentsStateStore) {}

  ngOnInit() {
    this.listenToOrientationChange()
    this.listenToMoneyAmounts()
    this.listenToComponentsState()
    this.listenToBuildingsState()
    // Listen to Construction tab state
  }
  
  listenToMoneyAmounts() {
    this.subs.sink = this.userStore.stateChanged.subscribe((state: IStoreState) => {
      this.coinMoney = state.user.coinMoney
      this.cashMoney = state.user.cashMoney
    })
  }

  listenToComponentsState() {
    this.subs.sink = this.componentStateStore.stateChanged.subscribe((state: IStoreState) => {
      this.showConstructionTab = state.showConstuctionTab
    })
  }
  
  listenToBuildingsState() {
    this.subs.sink = this.buildingStore.stateChanged.subscribe((state: IStoreState) => {
      this.buildings = state.buildings
    })
  }
  
  listenToOrientationChange() {
    window.addEventListener("orientationchange", () => {    
      this.updateMarginBottomMinimap()
    }, true);
  }
  
  openConstructionTab() {
    this.componentStateStore.changeComponentState(ComponentStateActions.OpenConstructionTab)
  }

  closeConstructionBuildingsTab() {
    this.componentStateStore.changeComponentState(ComponentStateActions.CloseConstructionTab)
  }

  allowBuildingPlacement() {
    this.componentStateStore.changeComponentState(ComponentStateActions.CloseConstructionTab)
    this.map.on('click', event => {
      console.log("TCL: HomePage -> allowBuildingPlacement -> event", event)      
    })
  }

  onMapAlmostReady(map: L.Map) {
    this.map = map
    setTimeout(() => {
      map.invalidateSize()
      this.onMapReady()
    }, 0)
    map.removeControl(map.zoomControl)
  }

  onMapReady() {
    this.addMinimap()
    // this.addRouting()
  }

  continueMission () {
    this.missionIsRunning = true 
    for (const marker of this.movingMarkers) marker.start()
  }

  pauseMission () {
    this.missionIsRunning = false
    for (const marker of this.movingMarkers) marker.pause()
  }

  addMinimap() {
    let rect1 = {color: "#f04141", weight: 2};
    let rect2 = {color: "#0000AA", weight: 1, opacity:0, fillOpacity:0};
    
    let osm = new L.TileLayer(this.osmStreetMap)
    this.miniMap = new MiniMap(osm, { 
      minZoom: 0, 
      maxZoom: 13, 
      toggleDisplay: true, 
      minimized: false,
      collapsedWidth: 50,
      collapsedHeight: 50,
      aimingRectOptions : rect1,
      shadowRectOptions: rect2,
      height: 120,
      width: 120
    })
    // .addTo(this.map)
    // this.setMinimapStyles(this.miniMap._container.style)
    // this.updateMarginBottomMinimap()
  }

  setMinimapStyles (styles) {
    styles.border = "2px solid #f04141"
    styles.boxShadow = "8px 6px 8px -4px rgba(0,0,0,0.75)"
    styles.borderRadius = "5px"
    styles.borderRadius = "margin-bottom: 75px;"
  }

  updateMarginBottomMinimap() {
    if (window.orientation === 0 && window.innerWidth < 900) {
      this.miniMap._container.style.marginBottom = "75px"
    }
    if (window.orientation === 90) {
      this.miniMap._container.style.marginBottom = "0px"
    }
  }

  addRouting() {
    let control = L.Routing.control({
      waypoints: [
        L.latLng(43.609598, 1.401405),
        L.latLng(43.601380, 1.433971)
      ],
      router: new L.Routing.Here('Wggb4j1DYHP72PKLC4Ij', 'VU2EFLLwNPnRdsGj06bBDw')
    }).addTo(this.map)
    
    control.on('routeselected', event => {
      let coords = event.route.coordinates;
      let instr = event.route.instructions;
      // this.getTheTruckMoving(coords)
    });
  }

  getTheTruckMoving(coords) {
    if (!this.firstMissionstarted) this.firstMissionstarted = true
    coords = [...route01Duration]
    this.continueMission()
    this.disableMissionButton = true
    setTimeout(() => {
      this.disableMissionButton = false
    }, 5000);

    let marker = L.movingMarker([37.809185, -122.477351], {
      destinations: coords,
      icon: this.redAmbuIcon.icon
    });
    this.movingMarkers.push(marker)
    marker.addTo(this.map);
  }

  signout() {
    this.router.navigate(['/auth'])
    this.authService.signout()
  }
}
