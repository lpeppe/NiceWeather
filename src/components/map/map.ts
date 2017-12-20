import { DataProvider } from './../../providers/data/data';
import { StatusProvider } from './../../providers/status/status';

import { Component } from '@angular/core';
import { LatLng } from './../../app/interfaces';
import {
  sunClusterOptions,
  invisibleIcon,
  visibleIcon,
  skiIcon,
  activityClusterOptions
} from '../../app/cluster-settings';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Platform } from 'ionic-angular';

const maxZoom = 11;
const minZoom = 6;
const circleRadius = 100;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  map: L.Map;
  sunMarkers: L.LayerGroup;
  activityMarkers: L.LayerGroup;
  searchCircle: L.CircleMarker;

  constructor(public statusProvider: StatusProvider, public dataProvider: DataProvider, public platform: Platform) {
    this.activityMarkers = new L.LayerGroup();
  }

  async ngAfterViewInit() {
    await this.platform.ready()
    this.loadMap();
    this.setupMarkerClusterers();
    this.loadSunMarkersData()
      .then(_ => this.map.addLayer(this.sunMarkers))
      .catch(err => console.log(err))
    this.searchCircle = new L.CircleMarker(this.map.getCenter(), { radius: circleRadius })
    this.map.on('move', _ => this.searchCircle.setLatLng(this.map.getCenter()))
    this.setObservables();
  }

  loadMap() {
    this.map = L.map('mapDiv', {
      zoomControl: false, maxZoom, minZoom
    }).setView([41.9102415, 12.3959139], 6);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  setupMarkerClusterers() {
    this.sunMarkers = L.markerClusterGroup(sunClusterOptions);
    // this.activityMarkers = L.markerClusterGroup(activityClusterOptions);
    this.activityMarkers = new L.LayerGroup();
  }

  async loadSunMarkersData(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let [points, forecast] = await this.dataProvider.getSunData();
        for (let id in points) {
          if (points[id].lat)
            this.sunMarkers.addLayer(L.marker([points[id].lat, points[id].lng], {
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

  setObservables(): void {
    this.statusProvider.placeSelected.subscribe((latLng: LatLng) => this.map.flyTo(latLng, maxZoom))

    this.statusProvider.activityMenuOpened.subscribe((isOpened: boolean) => {
      if (isOpened) {
        this.map.removeLayer(this.sunMarkers);
        this.map.addLayer(this.searchCircle);
      }
      else {
        this.map.removeLayer(this.searchCircle);
        this.map.removeLayer(this.activityMarkers);
        this.map.addLayer(this.sunMarkers);
      }
    })

    this.statusProvider.rangeChanged.subscribe((range: number) => {
      this.searchCircle.setRadius(range * 1000);
    })

    this.statusProvider.activitySearched.subscribe(_ => {
      this.activityMarkers.clearLayers();
      this.dataProvider.getSkiStations(this.map.getCenter(), this.calculateRadius())
        .subscribe(data => {
          for (let coord of data)
            this.activityMarkers.addLayer(new L.Marker((coord), { icon: skiIcon }))
          this.map.addLayer(this.activityMarkers);
          this.statusProvider.activityFound.next();
        }, _ => this.statusProvider.activityFound.next())
    })
  }

  calculateRadius(): number {
    let point = this.map.latLngToContainerPoint(this.map.getCenter());
    point.x += circleRadius;
    let latlngPoint = this.map.containerPointToLatLng(point);
    return (this.map.distance(this.map.getCenter(), latlngPoint) / 1000);
  }

}
