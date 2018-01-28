import { LatLng } from './../../models/interfaces';
import { Observable } from 'rxjs/Observable';
import { DataProvider } from './../../providers/data/data';
import { StatusProvider } from './../../providers/status/status';
import { GeoqueryProvider } from '../../providers/geoquery/geoquery';

import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SelectedActivity } from './../../models/enums';
import { getClusterOptions, invisibleIcon, visibleIcon, getActivityIconOptions } from '../../app/cluster-settings';

import { AngularFireDatabase } from 'angularfire2/database';

import * as turfHelpers from '@turf/helpers';

import 'rxjs/add/operator/take';
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
  activityMarkers: { [activity: string]: { [markerId: string]: L.Marker } };
  activityClusterers: { [key: string]: L.LayerGroup };
  geoJson: L.GeoJSON;

  constructor(public statusProvider: StatusProvider,
    public dataProvider: DataProvider,
    public platform: Platform,
    public geoQueryProvider: GeoqueryProvider,
    public db: AngularFireDatabase) {

    this.activityClusterers = {};
    this.activityMarkers = {};
    this.clearActivityMarkers();
  }

  async ngAfterViewInit() {
    await this.platform.ready()
    this.loadMap();
    this.setObservables();
  }

  loadMap(): void {
    let mapPosition = this.statusProvider.mapPosition.getValue();
    this.map = L.map('mapDiv', {
      zoomControl: false, minZoom
    }).setView([mapPosition.coords.lat, mapPosition.coords.lng], mapPosition.zoom);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
      // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.sunClusterer = L.markerClusterGroup(getClusterOptions(SelectedActivity.sun));
    this.map.addLayer(this.sunClusterer);
    this.initActivityClusters();
  }

  loadMapData(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let activity = this.statusProvider.selectedActivity.getValue();
        if (activity == SelectedActivity.sun) {
          this.map.setMaxZoom(maxZoom);
          this.clearActivityLayers();
          this.sunClusterer.clearLayers();
          await this.loadSunData();
          resolve();
        }
        else {
          this.map.setMaxZoom(18);
          this.sunClusterer.clearLayers();
          this.clearActivityLayers();
          this.clearActivityMarkers();
        }
      }
      catch (err) {
        reject(err)
      }
    })
  }

  loadSunData(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
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
        resolve()
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
        this.statusProvider.mapRadius = Number((this.map
          .distance(this.map.getBounds().getNorthEast(), this.map.getCenter()) / 1000)
          .toFixed(2));
      }, err => console.log(err))

    this.statusProvider.selectedDay
      .subscribe(_ => this.loadMapData())

    this.statusProvider.selectedActivity
      .subscribe(_ => this.loadMapData())

    this.geoQueryProvider.keyEntered.subscribe(data => {
      let id = Object.keys(data)[0];
      let activity = this.statusProvider.selectedActivity.getValue();
      if (!this.activityMarkers[SelectedActivity[activity]][id]) {
        let marker = (<any>L).marker([data[id].lat, data[id].lng], {
          icon: (<any>L).BeautifyIcon.icon(getActivityIconOptions(this.statusProvider.selectedActivity.getValue())),
          customId: id
        });
        let classInstance = this;
        marker.on('click', function (ev) {
          classInstance.onMarkerClicked(this);
        })
        this.activityMarkers[SelectedActivity[activity]][id] = marker;
        this.activityClusterers[SelectedActivity[activity]].addLayer(this.activityMarkers[SelectedActivity[activity]][id])
      }
    })

    this.geoQueryProvider.keyExited.subscribe(data => {
      let activity = this.statusProvider.selectedActivity.getValue();
      let id = Object.keys(data)[0];
      let markerToRemove = this.activityMarkers[SelectedActivity[activity]][id];
      this.activityClusterers[SelectedActivity[activity]].removeLayer(markerToRemove);
      this.activityMarkers[SelectedActivity[activity]][id] = null;
    })
  }

  initActivityClusters() {
    for (let activity in SelectedActivity) {
      if (isNaN(<any>activity) && activity != SelectedActivity[SelectedActivity.sun]) {
        this.activityClusterers[activity] = L.markerClusterGroup(getClusterOptions(<any>SelectedActivity[activity]))
        this.map.addLayer(this.activityClusterers[activity])
      }
    }
  }

  clearActivityLayers() {
    if (this.geoJson)
      this.map.removeLayer(this.geoJson);
    for (let act in SelectedActivity)
      if (isNaN(<any>act) && act != SelectedActivity[SelectedActivity.sun])
        this.activityClusterers[act].clearLayers();
  }

  clearActivityMarkers() {
    for (let activity in SelectedActivity)
      if (isNaN(<any>activity) && activity != SelectedActivity[SelectedActivity.sun])
        this.activityMarkers[activity] = {};
  }

  onMarkerClicked(marker: any) {
    switch (this.statusProvider.selectedActivity.getValue()) {
      case SelectedActivity.bike:
        this.db.object(`newdb/bike/paths/${marker.options.customId}`).valueChanges().take(1)
          .subscribe((data: LatLng[]) => {
            if (this.geoJson)
              this.map.removeLayer(this.geoJson);
            this.geoJson = L.geoJSON(turfHelpers.lineString(data.map(x => {
              return [x.lng, x.lat]
            })));
            this.map.fitBounds(this.geoJson.getBounds());
            this.geoJson.addTo(this.map)
          })
    }
  }
}


