import { DataProvider } from './../../providers/data/data';
import { StatusProvider } from './../../providers/status/status';

import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LatLng } from './../../models/interfaces';
import { SelectedActivity } from './../../models/enums';
import { getClusterOptions, invisibleIcon, visibleIcon } from '../../app/cluster-settings';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import '../../assets/js/leaflet-beautify-marker-icon';

const maxZoom = 11;
const minZoom = 8;
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  map: L.Map;
  sunClusterer: L.LayerGroup;
  activityMarkers: L.LayerGroup;
  activityClusterer: L.LayerGroup;

  constructor(public statusProvider: StatusProvider, public dataProvider: DataProvider, public platform: Platform) {
    this.activityMarkers = new L.LayerGroup();
  }

  async ngAfterViewInit() {
    await this.platform.ready()
    this.loadMap();
    this.setObservables();
  }

  loadMap(): void {
    let mapPosition = this.statusProvider.mapPosition.getValue();
    this.map = L.map('mapDiv', {
      zoomControl: false, maxZoom, minZoom
    }).setView([mapPosition.coords.lat, mapPosition.coords.lng], mapPosition.zoom);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
      // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.sunClusterer = L.markerClusterGroup(getClusterOptions(SelectedActivity.sun));
    this.map.addLayer(this.sunClusterer);
  }

  loadMapData(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.statusProvider.selectedActivity.getValue() == SelectedActivity.sun) {
          this.sunClusterer.clearLayers();
          let [points, forecast] = await this.dataProvider.getSunData();
          let layers = [];
          for (let id in points) {
            for (let point of points[id]) {
              layers.push(L.marker([point.lat, point.lng], {
                icon: forecast[this.statusProvider.selectedDay.getValue()][id].sunny ? visibleIcon : invisibleIcon
              }))
            }
          }
          (<any>this.sunClusterer).addLayers(layers)
          resolve();
        }
        else {
          this.sunClusterer.clearLayers();
        }
      }
      catch (err) {
        reject(err)
      }
    })
  }

  setObservables() {
    this.map.on('moveend', _ => {
      this.statusProvider.mapPosition.next({
        coords: {
          lat: this.map.getCenter().lat,
          lng: this.map.getCenter().lng
        },
        triggerMapMove: false
      })
    })

    this.statusProvider.mapPosition
      .subscribe((position) => {
        if (position.triggerMapMove)
          this.map.flyTo(position.coords, position.zoom);
      }, err => console.log(err))

    this.statusProvider.selectedDay
      .subscribe(_ => this.loadMapData())

    this.statusProvider.selectedActivity
      .subscribe(_ => this.loadMapData())
  }
}


