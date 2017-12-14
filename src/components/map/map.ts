import { DataProvider } from './../../providers/data/data';
import { StatusProvider } from './../../providers/status/status';

import { Component } from '@angular/core';
import { LatLng } from './../../app/interfaces';
import { clusterOptions, invisibleIcon, visibleIcon, skiIcon } from '../../app/cluster-settings';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  map: L.Map;
  markers: L.LayerGroup;
  activityMarkers: L.LayerGroup;
  searchCircle: L.Circle;

  constructor(public statusProvider: StatusProvider, public dataProvider: DataProvider, public platform: Platform) {
    this.activityMarkers = new L.LayerGroup();
  }

  async ngAfterViewInit() {
    await this.platform.ready()
    await this.loadMap();
    this.searchCircle = new L.Circle(this.map.getCenter(), { radius: 50000 })
    this.map.on('move', _ => this.searchCircle.setLatLng(this.map.getCenter()))
    this.statusProvider.placeSelected.subscribe(data => this.map.flyTo(data, 11))
  }

  async loadMap(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.map = L.map('mapDiv', {
        zoomControl: false
      }).setView([41.9102415, 12.3959139], 6);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      this.markers = L.markerClusterGroup(clusterOptions);
      try {
        await this.loadMarkersData();
        this.map.addLayer(this.markers)
        resolve();
      }
      catch (err) {
        console.log(err)
        reject(err);
      }
    })
  }

  async loadMarkersData(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let [points, forecast] = await this.dataProvider.getSunData();
        for (let id in points) {
          if (points[id].lat)
            this.markers.addLayer(L.marker([points[id].lat, points[id].lng], {
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

}
