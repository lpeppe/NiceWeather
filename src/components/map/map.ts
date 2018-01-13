import { DataProvider } from './../../providers/data/data';
import { StatusProvider } from './../../providers/status/status';

import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LatLng } from './../../models/interfaces';
import { SelectedActivity } from './../../models/enums';
import { getClusterOptions, invisibleIcon, visibleIcon, getActivityIconOptions } from '../../app/cluster-settings';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-draw';
import '../../assets/js/leaflet-beautify-marker-icon';

const maxZoom = 11;
const minZoom = 6;
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  map: L.Map;
  sunClusterer: L.LayerGroup;
  activityMarkers: L.LayerGroup;
  activityClusterer: L.LayerGroup;
  searchGroup: L.FeatureGroup;
  circleDrawer: L.Draw.Circle;

  constructor(public statusProvider: StatusProvider, public dataProvider: DataProvider, public platform: Platform) {
    this.activityMarkers = new L.LayerGroup();
    this.searchGroup = new L.FeatureGroup();
  }

  async ngAfterViewInit() {
    await this.platform.ready()
    await this.loadMap();
    this.initSearchLayer();
    this.setObservables();
  }

  async loadMap(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.map = L.map('mapDiv', {
        zoomControl: false, maxZoom, minZoom
      }).setView([41.9102415, 12.3959139], 6);
      // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      this.sunClusterer = L.markerClusterGroup(getClusterOptions(SelectedActivity.sun));
      try {
        await this.loadSunData();
        this.map.addLayer(this.sunClusterer)
        resolve();
      }
      catch (err) {
        console.log(err)
        reject(err);
      }
    })
  }

  async loadSunData(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let [points, forecast] = await this.dataProvider.getSunData();
        for (let id in points) {
          if (points[id].lat)
            this.sunClusterer.addLayer(L.marker([points[id].lat, points[id].lng], {
              icon: forecast[id].sunny ? visibleIcon : invisibleIcon
            }))
        }
        resolve();
      }
      catch (err) {
        console.log(err)
        reject(err)
      }
    })
  }

  initSearchLayer() {
    var drawnItems = new L.FeatureGroup();
    this.map.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        edit: false,
        remove: false
      },
      draw: {
        polyline: false,
        circle: false,
        polygon: false,
        rectangle: false,
        circlemarker: false,
        marker: false
      }
    });
    this.map.addControl(drawControl);
    this.map.on('draw:created', event => this.onDrawCreated(event))
    this.circleDrawer = new L.Draw.Circle(this.map);
  }

  setObservables() {
    this.statusProvider.placeSelected.subscribe((latLng: LatLng) => this.map.flyTo(latLng, maxZoom))
    this.statusProvider.selectedActivity.subscribe((activity: SelectedActivity) => {
      if (activity != SelectedActivity.sun) {
        this.map.removeLayer(this.sunClusterer);
        this.activityMarkers.clearLayers();
        this.circleDrawer.enable();
        if(this.activityClusterer)
          this.map.removeLayer(this.activityClusterer)
        this.activityClusterer = L.markerClusterGroup(getClusterOptions(activity));
        this.map.addLayer(this.activityClusterer)
      }
      else {
        this.circleDrawer.disable();
        this.activityMarkers.clearLayers();
        if (this.activityClusterer)
          this.map.removeLayer(this.activityClusterer)
        this.map.addLayer(this.sunClusterer);
      }
    })
  }

  onDrawCreated(event: any) {
    this.activityMarkers.clearLayers();
    this.dataProvider.getSkiStations(event.layer._latlng, event.layer._mRadius / 1000)
      .subscribe(data => {
        for (let coord of data) {
          this.activityClusterer.addLayer(L.marker(coord, {
            icon: (<any>L).BeautifyIcon.icon(getActivityIconOptions(this.statusProvider.selectedActivity.getValue()))
          }))
        }
        this.map.addLayer(this.activityMarkers);
      })
  }
}


