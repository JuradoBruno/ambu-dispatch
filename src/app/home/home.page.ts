import { Component } from '@angular/core';
import * as L from 'leaflet';
import * as PIXI from 'pixi.js'
import * as _ from 'lodash'
import MiniMap from 'leaflet-minimap';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine-here';
import '../services/moving-marker.service';
// import "../services/AnimatedMarker.js"
import 'leaflet-pixi-overlay'
import route01 from "../services/route01.json"
import route01Duration from "../services/route01-duration.json"
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { SubSink } from 'subsink';
import { IStoreState } from '../core/stores/store-state.interface';
import { ComponentsStateStore, ComponentStateActions } from '../core/stores/components-state.store';
import { UserStore } from '../core/stores/user.store';
import { BuildingsStore } from '../core/stores/buildings.store';
import { Building } from '../models/Buildings.model';
import { BuildingsService } from '../core/services/buildings.service';
import { IBuildingToUser, User } from '../models/User.model';
(<any>window).MSStream
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  subs = new SubSink()

  user: User
  map
  miniMap
  osmStreetMap = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  osmWiki = 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
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
      iconUrl: 'assets/icon/iso-hospital-min.png'
    }
    )
  }
  // Define our base layers so we can reference them multiple times
  streetMaps = L.tileLayer(this.osmStreetMap, {
    detectRetina: true,
    maxZoom: 19
  });
  wMaps = L.tileLayer(this.osmWiki, {
    detectRetina: true,
    maxZoom: 19
  });

  // Marker for the parking lot at the base of Mt. Ranier trails
  redAmbu = L.marker([43.609598, 1.401405], this.redAmbuIcon);
  // hopital1 = L.marker([43.609598, 1.401405], this.hopitalIcon);
  // hopital2 = L.marker([43.601380, 1.433971], this.hopitalIcon);

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
    // layers: [this.streetMaps, this.hopital1, this.hopital2],
    preferCanvas: true,
    layers: [this.wMaps],
    minZoom: 4,
    maxZoom: 18,
    maxNativeZoom: 18,
    zoom: 15,
    bounceAtZoomLimits: false,
    center: L.latLng([43.609598, 1.401405]),
  };

  desiredScale = 0
  lastEvent = null
  utils = null
  frame = null
  start = null
  progress = null
  prevZoom = null
  renderer: any;
  container: any;
  pixiOverlay: any;
  markerSprites: any[] = []
  pixiContainer: PIXI.Container = new PIXI.Container()
  pixiLoader = new PIXI.Loader();
  hopitalTexture: PIXI.Texture = PIXI.Texture.from('assets/icon/iso-hospital-min.png')

  coinMoney: any;
  cashMoney: any;
  showConstructionTab: boolean;
  buildings: Building[]
  buildingsToUser: IBuildingToUser[] = []
  buildingsToUserToAddToRendering: IBuildingToUser[] = []

  firstDraw = true
  isMouseDownToAddBuilding = false
  allowBuildingPlacement = false
  mouseDownToAddBuildingTimeout: any
  buildingToCreateAndMoneyType: {building: Building, moneyType: string}

  constructor(
    private router: Router,
    private authService: AuthService,
    private userStore: UserStore,
    private buildingsService: BuildingsService,
    private buildingStore: BuildingsStore,
    private componentStateStore: ComponentsStateStore) { }

  ngOnInit() {
    this.listenToUserState()
    this.listenToBuildingsState()
    this.listenToComponentsState()
    this.pixiLoader.add('hopital1', 'assets/icon/iso-hospital-min.png', new PIXI.Circle(0, 0, 20))
  }

  listenToUserState() {
    this.subs.sink = this.userStore.stateChanged.subscribe((state: IStoreState) => {
      if (!state.user) {
        this.authService.getUser()
        return
      }
      this.user = state.user
        
      this.coinMoney = state.user.coinMoney
      this.cashMoney = state.user.cashMoney
      if ((this.buildingsToUser.length < state.user.buildingsToUser.length)) {
        this.firstDraw = true
        if (this.buildingsToUserToAddToRendering.length == 0) {
          this.buildingsToUserToAddToRendering = state.user.buildingsToUser
        }
        else {
          let newBuilding = _.maxBy(state.user.buildingsToUser, 'createdAt') // Getting only the last one
          this.buildingsToUserToAddToRendering = [newBuilding]
        }
        // this.buildingsToUser = state.user.buildingsToUser
        // this.drawPIXIMarker()
        if (this.pixiOverlay){
          this.pixiOverlay.redraw(this.utils, this.lastEvent)
        } 
        // return
      }
      this.buildingsToUser = state.user.buildingsToUser
    })
  }

  listenToComponentsState() {
    this.subs.sink = this.componentStateStore.stateChanged.subscribe((state: IStoreState) => {
      this.showConstructionTab = state.showConstuctionTab
    })
  }

  listenToBuildingsState() {
    this.subs.sink = this.buildingStore.stateChanged.subscribe((state: IStoreState) => {
      if (state.buildings.length === 0) this.buildingsService.getBuildings()
      this.buildings = state.buildings
    })
  }

  instanciatePixiOverlay() {
    
    this.pixiOverlay = L.pixiOverlay((utils, event) => {
        this.lastEvent = event
        this.utils = utils
        let zoom = utils.getMap().getZoom();
        if (this.frame) {
          cancelAnimationFrame(this.frame);
          this.frame = null;
        }
        
        this.container = utils.getContainer();
        // this.container.cacheAsBitmap = true
        this.renderer = utils.getRenderer();
        let project = utils.latLngToLayerPoint;
        let scale = utils.getScale();
        if (zoom >= 17) this.desiredScale = 0.003;
        if (zoom == 16) this.desiredScale = 0.005;
        if (zoom == 15) this.desiredScale = 0.008;
        if (zoom == 14) this.desiredScale = 0.010;
        if (zoom == 13) this.desiredScale = 0.013;
        if ( zoom < 13) this.desiredScale = 0.015;
        
        if (this.firstDraw) {
          this.prevZoom = zoom;
          for (const building of this.buildingsToUserToAddToRendering) {
            let coords = project([building.coordinates.x, building.coordinates.y]);
            let markerSprite = new PIXI.Sprite(this.hopitalTexture);
            markerSprite.cacheAsBitmap = true
            markerSprite.interactive = true;
            markerSprite.buttonMode = true;
            markerSprite.x = coords.x;
            markerSprite.y = coords.y;
            markerSprite.anchor.set(0.5, 0.5);
            markerSprite.scale.set(this.desiredScale)
            markerSprite.id = building.buildingsToUserId
            markerSprite.on('pointertap', event => {
            })
            this.container.addChild(markerSprite);
            this.markerSprites.push(markerSprite);
          }
          this.buildingsToUserToAddToRendering = []
        }
        if (this.firstDraw || this.prevZoom !== zoom) {
          for (const markerSprite of this.markerSprites) {
            if (this.firstDraw) {
              markerSprite.scale.set(this.desiredScale);
            } else {
              markerSprite.currentScale = markerSprite.scale.x;
              markerSprite.targetScale = this.desiredScale;
            }
          }
        }

        if (!this.firstDraw && this.prevZoom !== zoom) {
          this.start = null
          this.progress = null
          this.frame = requestAnimationFrame(this.animateMarker.bind(this));
        }
        this.firstDraw = false;
        this.prevZoom = zoom;
        this.renderer.render(this.container);
      }, this.pixiContainer, {
        doubleBuffering: false
      })

      this.pixiOverlay.addTo(this.map)
  }

  drawPIXIMarker() {
    // var easing = BezierEasing(0, 0, 0.25, 1);

    this.pixiLoader.load((loader, resources) => {

      let prevZoom;

      this.frame = null;
      let focus = null;
      let doubleBuffering = /iPad|iPhone|iPod/.test(navigator.userAgent);
      this.instanciatePixiOverlay()
      // let doubleBuffering = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    })
  }

  animateMarker(timestamp) {
    let delta = 250
    if (this.start === null) this.start = timestamp;
    this.progress = timestamp - this.start;
    let lambda = this.progress / delta;
    if (lambda > 1) lambda = 1;
    lambda = lambda * (0.4 + lambda * (2.2 + lambda * -1.6));
    for (const markerSprite of this.markerSprites) {
      markerSprite.scale.set(markerSprite.currentScale + lambda * (markerSprite.targetScale - markerSprite.currentScale));
    }
    this.renderer.render(this.container);
    if (this.progress < delta) {
      this.frame = requestAnimationFrame(this.animateMarker.bind(this));
    }
  }

  listenToZoom() {
    this.map.on('zoomstart', event => {
      // this.frame = requestAnimationFrame(this.animateMarker.bind(this));
    })
    this.map.on('zoomend', event => {
      // cancelAnimationFrame(this.frame)
    })
  }

  openConstructionTab() {
    this.componentStateStore.changeComponentState(ComponentStateActions.OpenConstructionTab)
  }

  closeConstructionBuildingsTab() {
    this.componentStateStore.changeComponentState(ComponentStateActions.CloseConstructionTab)
  }

  startBuildingPlacement(building: Building, moneyType: string) {
    this.componentStateStore.changeComponentState(ComponentStateActions.CloseConstructionTab)
    this.buildingToCreateAndMoneyType = {building, moneyType}
    this.allowBuildingPlacement = true
  }

  // Used to create buildings
  onPress($event) {
    if (!this.allowBuildingPlacement) return
    let moneyKeyBuilding = this.buildingToCreateAndMoneyType.moneyType + 'Price'
    let moneyKeyUser = this.buildingToCreateAndMoneyType.moneyType + 'Money'
    if (this.user[moneyKeyUser] < this.buildingToCreateAndMoneyType.building[moneyKeyBuilding]) {
      // Show modal: Not enough money
      this.allowBuildingPlacement = false
      return
    }
    this.user[moneyKeyUser] -= this.buildingToCreateAndMoneyType.building[moneyKeyBuilding]
    this.userStore.storeCurrentUser(this.user)
    // Check if user has enough money
    let latlng = this.map.mouseEventToLatLng($event.srcEvent)
    this.buildingsService.addBuilding(latlng, this.buildingToCreateAndMoneyType)
    this.allowBuildingPlacement = false
  }

  onPressUp($event) {

  }

  onMapAlmostReady(map: L.Map) {
    this.map = map
    setTimeout(() => {
      this.map.invalidateSize()
      this.map.removeControl(this.map.zoomControl)
      new L.Control.Zoom({ position: 'bottomleft' }).addTo(this.map)
      this.onMapReady()
    }, 0)
  }

  onMapReady() {
    this.drawPIXIMarker()
    this.addMinimap()
    this.listenToZoom()
    // this.addRouting()
  }

  continueMission() {
    this.missionIsRunning = true
    for (const marker of this.movingMarkers) marker.start()
  }

  pauseMission() {
    this.missionIsRunning = false
    for (const marker of this.movingMarkers) marker.pause()
  }

  addMinimap() {
    let rect1 = { color: "#f04141", weight: 2 };
    let rect2 = { color: "#0000AA", weight: 1, opacity: 0, fillOpacity: 0 };

    let osm = new L.TileLayer(this.osmStreetMap)
    this.miniMap = new MiniMap(osm, {
      minZoom: 0,
      maxZoom: 13,
      toggleDisplay: true,
      minimized: false,
      collapsedWidth: 50,
      collapsedHeight: 50,
      aimingRectOptions: rect1,
      shadowRectOptions: rect2,
      height: 120,
      width: 120
    })
    // .addTo(this.map)
    // this.setMinimapStyles(this.miniMap._container.style)
    // this.updateMarginBottomMinimap()
  }

  setMinimapStyles(styles) {
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
