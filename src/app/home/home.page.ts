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
import { Building } from '../models/Building.model';
import { BuildingsService } from '../core/services/buildings.service';
import { BuildingToUser, User, MissionToUser } from '../models/User.model';
import { ModalService } from '../core/modal/modal.service';
import { Mission } from '../models/Mission.model';
import { MissionsStore } from '../core/stores/missions.store';
import { MissionsService } from '../core/services/missions.service';
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
  project = null
  frame = null
  start = null
  progress = null
  prevZoom = null
  renderer: any;
  container: any;
  pixiOverlay: any;
  allSprites: PIXI.Sprite[] | any[] = []
  markerSprites: any[] = []
  buildingsSprites: PIXI.Sprite[] | any[] = []
  pixiContainer: PIXI.Container = new PIXI.Container()
  buildingsContainer: PIXI.Container = new PIXI.Container() 
  missionsSprites: PIXI.Sprite[] | any[] = [] 
  missionsContainer: PIXI.Container = new PIXI.Container()  
  vehiclesContainer: PIXI.Container = new PIXI.Container()  

  pixiLoader = new PIXI.Loader();
  
  hopitalTextureUri = 'assets/icon/hopital-texture.png'
  hopitalTexture: PIXI.Texture
  
  caserneAmbulanceTextureUri = 'assets/icon/caserne-ambulance.png'
  caserneAmbulanceTexture: PIXI.Texture
  
  missionTextureUri = 'assets/icon/excla-1.png'
  missionTexture: PIXI.Texture

  coinMoney: any;
  cashMoney: any;
  showConstructionTab: boolean;

  buildings: Building[]
  buildingsToUser: BuildingToUser[] = []
  buildingsToUserToAddToRendering: BuildingToUser[] = []
  selectedBuilding: BuildingToUser[] = []
  showBuildingInformations: boolean = false

  
  missions: Mission[] = []
  missionsToUser: MissionToUser[] = []
  missionsToUserToAddToRendering: MissionToUser[] = []

  firstDraw = true
  isMouseDownToAddBuilding = false
  allowBuildingPlacement = false
  mouseDownToAddBuildingTimeout: any
  buildingToCreateAndMoneyType: {building: Building, moneyType: string}
 
  constructor(
    private router: Router,
    private modal: ModalService,
    private authService: AuthService,
    private userStore: UserStore,
    private buildingsService: BuildingsService,
    private buildingsStore: BuildingsStore,
    private missionsService: MissionsService,
    private missionsStore: MissionsStore,
    private componentStateStore: ComponentsStateStore) { }

  ngOnInit() {
    this.hopitalTexture = PIXI.Texture.from(this.hopitalTextureUri)
    PIXI.Texture.addToCache(this.hopitalTexture, 'hopitalTexture')
    this.caserneAmbulanceTexture = PIXI.Texture.from(this.caserneAmbulanceTextureUri)
    PIXI.Texture.addToCache(this.caserneAmbulanceTexture, 'caserneAmbulanceTexture')
    this.missionTexture = PIXI.Texture.from(this.missionTextureUri)
    PIXI.Texture.addToCache(this.missionTexture, 'missionTexture')
    this.listenToBuildingsState()
    this.listenToMissionsState()
    this.listenToComponentsState()
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

      this.manageBuildingsToUser(state)
      this.manageMissionsToUser(state)
      this.container
      
    })
  }
  manageMissionsToUser(state) {
    if (state.user.missionsToUser.length === 0) return

    if ((this.missionsToUser.length < state.user.missionsToUser.length)) {
      this.firstDraw = true
      if (this.missionsToUserToAddToRendering.length == 0) {
        this.missionsToUserToAddToRendering = state.user.missionsToUser
      }
      else {
        let newMission = _.maxBy(state.user.missionsToUser, 'createdAt') // Getting only the last one
        this.missionsToUserToAddToRendering = [newMission]
      }
      this.populateMissionsContainer()
      this.missionsToUser = state.user.missionsToUser
      setTimeout(() => {
        this.pixiOverlay.redraw()        
      }, 500);
    }
  }

  manageBuildingsToUser(state) {
    if (state.user.buildingsToUser.length === 0) return

    if ((this.buildingsToUser.length < state.user.buildingsToUser.length)) {
      this.firstDraw = true
      if (this.buildingsToUserToAddToRendering.length == 0) {
        this.buildingsToUserToAddToRendering = state.user.buildingsToUser
      }
      else {
        let newBuilding = _.maxBy(state.user.buildingsToUser, 'createdAt') // Getting only the last one
        this.buildingsToUserToAddToRendering = [newBuilding]
      }
      this.populateBuildingsContainer()
      this.buildingsToUser = state.user.buildingsToUser
      setTimeout(() => {
        this.pixiOverlay.redraw()        
      }, 500);
    }
  }

  populateBuildingsContainer() {
    for (const building of this.buildingsToUserToAddToRendering) {
      let coords = this.project([building.coordinates.x, building.coordinates.y]);
      let buildingSprite = new BuildingSprite(this[building.building.textureName]);
      buildingSprite.cacheAsBitmap = true
      buildingSprite.interactive = true;
      buildingSprite.buttonMode = true;
      buildingSprite.x = coords.x;
      buildingSprite.y = coords.y;
      buildingSprite.anchor.set(0.5, 0.5);
      buildingSprite.scaleCoef = building.building.textureScale
      buildingSprite.scale.set(this.desiredScale * buildingSprite.scaleCoef)
      buildingSprite.id = building.buildingsToUserId
      buildingSprite.building = building
      buildingSprite.on('pointertap', event => {
        console.log("HomePage -> populateMissionsContainer -> event", event.target)
        this.selectedBuilding = event.target
      })
      this.buildingsContainer.addChild(buildingSprite);
      this.buildingsSprites.push(buildingSprite);
      this.allSprites.push(buildingSprite);
    }
  }

  populateMissionsContainer() {
    for (const mission of this.missionsToUserToAddToRendering) {
      let coords = this.project([mission.coordinates.x, mission.coordinates.y]);
      let missionSprite = new MissionSprite(this[mission.mission.textureName]);
      missionSprite.cacheAsBitmap = true
      missionSprite.interactive = true;
      missionSprite.buttonMode = true;
      missionSprite.x = coords.x;
      missionSprite.y = coords.y;
      missionSprite.anchor.set(0.5, 0.5);
      missionSprite.scaleCoef = mission.mission.textureScale
      missionSprite.scale.set(this.desiredScale * missionSprite.scaleCoef)
      missionSprite.id = mission.id
      missionSprite.mission = mission
      missionSprite.on('pointertap', event => {
        console.log("HomePage -> populateMissionsContainer -> event", event.target)
      })
      this.missionsContainer.addChild(missionSprite);
      this.missionsSprites.push(missionSprite); 
      this.allSprites.push(missionSprite); 
    }
  }

  listenToComponentsState() {
    this.subs.sink = this.componentStateStore.stateChanged.subscribe((state: IStoreState) => {
      this.showConstructionTab = state.showConstuctionTab
    })
  }

  listenToBuildingsState() {
    this.subs.sink = this.buildingsStore.stateChanged.subscribe((state: IStoreState) => {
      if (state.buildings.length === 0) this.buildingsService.getBuildings()
      this.buildings = state.buildings
    })
  }

  listenToMissionsState() {
    this.subs.sink = this.missionsStore.stateChanged.subscribe((state: IStoreState) => {
      if (state.missions.length === 0) this.missionsService.getMissions()
      this.missions = state.missions
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
        this.project = utils.latLngToLayerPoint;
        if (zoom >= 17) this.desiredScale = 0.003;
        if (zoom == 16) this.desiredScale = 0.005;
        if (zoom == 15) this.desiredScale = 0.008;
        if (zoom == 14) this.desiredScale = 0.010;
        if (zoom == 13) this.desiredScale = 0.013;
        if ( zoom < 13) this.desiredScale = 0.015;
        
        if (this.firstDraw) {
          this.prevZoom = zoom;
        }
        if (this.firstDraw || this.prevZoom !== zoom) {
          for (const sprite of this.allSprites) {
            if (this.firstDraw) {
              sprite.scale.set(this.desiredScale * sprite.scaleCoef);
            } else {
              sprite.currentScale = sprite.scale.x;
              sprite.targetScale = this.desiredScale * sprite.scaleCoef;
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
      this.listenToUserState()
      this.pixiContainer.addChild(this.buildingsContainer)
      this.pixiContainer.addChild(this.missionsContainer)
  }

  onSpriteClicked(event) {
  }

  drawPIXIMarker() {
    // var easing = BezierEasing(0, 0, 0.25, 1);

    this.pixiLoader.load((loader, resources) => {
      this.frame = null;
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
    for (const markerSprite of this.allSprites) {
      markerSprite.scale.set(markerSprite.currentScale + lambda * (markerSprite.targetScale - markerSprite.currentScale));
    }
    this.renderer.render(this.pixiContainer);
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
    let moneyKeyBuilding = moneyType + 'Price'
    let moneyKeyUser = moneyType + 'Money'
    if (this.user[moneyKeyUser] < building[moneyKeyBuilding]) {
      this.modal.show({
        header: 'Dommage!',
        body: "Vous n'avez pas assez d'argent pour construire ce bâtiment",
        cancelButtonVisible: false
      })
      return
    }
    this.componentStateStore.changeComponentState(ComponentStateActions.CloseConstructionTab)
    this.modal.show({
      header: 'Important',
      body: "Vous vous apprétez à construire un bâtiment. Appuyez longuement sur l'emplacement que vous avez choisi",
      cancelButtonVisible: false
    })
    this.buildingToCreateAndMoneyType = {building, moneyType}
    this.allowBuildingPlacement = true
  }

  // Used to create buildings
  onPress($event) {
    if (!this.allowBuildingPlacement) return
    let moneyKeyBuilding = this.buildingToCreateAndMoneyType.moneyType + 'Price'
    let moneyKeyUser = this.buildingToCreateAndMoneyType.moneyType + 'Money'
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
      this.onMapReady()
    }, 0)
  }

  onMapReady() {
    this.drawPIXIMarker()
    this.addMinimap()
    this.listenToZoom()
    // this.addRouting()
  }

  spawnMission() {
    // Associate a mission with the current user
    let mission = this.missions[0]
    // let latlng = {lat: 43.6098241940165, lng: 1.39453411102295}
    let latlng = {lat: 43.60684887974696, lng: 1.3940298557281494}
    this.missionsService.addMission(latlng, mission)
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

export class BuildingSprite extends PIXI.Sprite {
  id: number
  building: BuildingToUser
}

export class MissionSprite extends PIXI.Sprite {
  id: number
  mission: MissionToUser
}