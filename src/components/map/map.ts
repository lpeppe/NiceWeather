import { LatLng } from './../../models/interfaces';
import { Observable } from 'rxjs/Observable';
import { DataProvider } from './../../providers/data/data';
import { StatusProvider } from './../../providers/status/status';
import { GeoqueryProvider } from '../../providers/geoquery/geoquery';

import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SelectedActivity } from './../../models/enums';
import { getClusterOptions, invisibleIcon, visibleIcon, getActivityIconOptions } from '../../app/cluster-settings';

import * as turfHelpers from '@turf/helpers';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/merge';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import '../../assets/js/leaflet-beautify-marker-icon';

const maxZoom = 12;
const minZoom = 8;
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnDestroy, AfterViewInit {

  map: L.Map;
  sunClusterer: L.LayerGroup;
  tileLayer: L.TileLayer;
  activityMarkers: { [activity: string]: { [markerId: string]: L.Marker } };
  activityClusterers: { [key: string]: L.LayerGroup };
  geoJson: L.GeoJSON;
  subscriptions: Subscription[];

  constructor(public statusProvider: StatusProvider,
    public dataProvider: DataProvider,
    public platform: Platform,
    public geoQueryProvider: GeoqueryProvider) {

    this.activityClusterers = {};
    this.activityMarkers = {};
    this.clearActivityMarkers();
    this.subscriptions = [];
  }

  async ngAfterViewInit() {
    await this.platform.ready()
    this.loadMap();
    this.setObservables();
  }

  loadMap(): void {
    let mapPosition = this.statusProvider.mapPosition.getValue();
    this.map = L.map('mapDiv', {
      zoomControl: false, minZoom, maxZoom
    }).setView([mapPosition.coords.lat, mapPosition.coords.lng], mapPosition.zoom);
    this.subscriptions.push(
      this.statusProvider.toggleValues.subscribe(toggleValues => {
        if (this.tileLayer)
          this.map.removeLayer(this.tileLayer);
        this.tileLayer = L.tileLayer(this.getTileLayer(toggleValues));
        this.tileLayer.addTo(this.map);
      })
    );

    // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    // L.tileLayer('https://api.mapbox.com/styles/v1/marylen/cjd2vb5481zk32spdyzyjhir3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA', {
    // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(this.map);
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
          this.map.setMaxZoom(16);
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
              icon: forecast[id].sunny ? visibleIcon : invisibleIcon
            }))
          }
        }
        (<any>this.sunClusterer).addLayers(layers);
        resolve()
      }
      catch (err) {
        reject(err)
      }
    })
  }

  setObservables() {
    let moveEnd$ = new Observable(observer => {
      this.map.on('moveend', _ => {
        observer.next()
      })
    })

    this.subscriptions.push(
      moveEnd$.debounceTime(20)
        .subscribe(_ => {
          this.statusProvider.mapPosition.next({
            coords: {
              lat: this.map.getCenter().lat,
              lng: this.map.getCenter().lng
            },
            triggerMapMove: false
          })
        })
    );

    this.subscriptions.push(
      this.statusProvider.mapPosition
        .subscribe((position) => {
          if (position.triggerMapMove)
            this.map.flyTo(position.coords, position.zoom);
          this.statusProvider.mapRadius = Number((this.map
            .distance(this.map.getBounds().getNorthEast(), this.map.getCenter()) / 1000)
            .toFixed(2));
        }, err => console.log(err))
    );

    this.subscriptions.push(
      this.statusProvider.selectedActivity
        .merge(this.statusProvider.selectedDays)
        .debounceTime(20)
        .subscribe(_ => this.loadMapData()
          .catch(err => console.log(err)))
    )

    this.subscriptions.push(
      this.statusProvider.favouritesMode
        .subscribe(_ => {
          this.clearActivityLayers()
          this.clearActivityMarkers()
        })
    )

    this.subscriptions.push(
      this.geoQueryProvider.keyEntered
        .subscribe(data => this.addActivityMarker(data))
    );
    this.subscriptions.push(
      this.statusProvider.placeSelected
        .subscribe(id => this.onPlaceSelected(id))
    );

    this.subscriptions.push(
      this.geoQueryProvider.keyExited
        .subscribe(data => this.removeActivityMarker(data))
    );
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

  async onPlaceSelected(id: string) {
    if (id) {
      switch (this.statusProvider.selectedActivity.getValue()) {
        case SelectedActivity.bike:
          let data = await this.dataProvider.getBikePath();
          if (this.geoJson)
            this.map.removeLayer(this.geoJson);
          this.geoJson = L.geoJSON(turfHelpers.lineString(data.map(x => {
            return [x.lng, x.lat]
          })), {
              style: _ => {
                return {
                  color: "#029DC0"
                }
              }
            });
          this.map.fitBounds(this.geoJson.getBounds());
          this.geoJson.addTo(this.map)
          break;
        case SelectedActivity.ski: case SelectedActivity.sea:
          this.map.setView(await this.dataProvider.getPlaceLatLng(), 16);
          break;
      }
    }
    else if (this.geoJson)
      this.map.removeLayer(this.geoJson);
  }

  addActivityMarker(data: { [key: string]: LatLng }) {
    let id = Object.keys(data)[0];
    let activity = this.statusProvider.selectedActivity.getValue();
    if (!this.activityMarkers[SelectedActivity[activity]][id]) {
      let marker = (<any>L).marker([data[id].lat, data[id].lng], {
        icon: (<any>L).BeautifyIcon.icon(getActivityIconOptions(this.statusProvider.selectedActivity.getValue())),
        customId: id
      });
      let classInstance = this;
      marker.on('click', function (ev) {
        classInstance.statusProvider.placeSelected.next(this.options.customId);
      })
      this.activityMarkers[SelectedActivity[activity]][id] = marker;
      this.activityClusterers[SelectedActivity[activity]].addLayer(this.activityMarkers[SelectedActivity[activity]][id])
    }
  }

  removeActivityMarker(data: { [key: string]: LatLng }) {
    let activity = this.statusProvider.selectedActivity.getValue();
    let id = Object.keys(data)[0];
    let markerToRemove = this.activityMarkers[SelectedActivity[activity]][id];
    this.activityClusterers[SelectedActivity[activity]].removeLayer(markerToRemove);
    this.activityMarkers[SelectedActivity[activity]][id] = null;
  }

  getTileLayer(toggleValues: boolean[]): string {
    if (!toggleValues[0]) {
      if (!toggleValues[1] && !toggleValues[2])
        return "https://api.mapbox.com/styles/v1/marylen/cjdkc19c72k0u2sqj81swjzqh/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA";
      if (!toggleValues[1])
        return "https://api.mapbox.com/styles/v1/marylen/cjdkbyfu12jrp2sqp49kbe6ai/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA";
      if (!toggleValues[2])
        return "https://api.mapbox.com/styles/v1/marylen/cjdkc82tu2nsd2rumm56rjvn0/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA"
      return "https://api.mapbox.com/styles/v1/marylen/cjdkaw4va2n1g2rqvx0xlg5xb/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA";
    }
    else if (!toggleValues[1]) {
      if (!toggleValues[2])
        return "https://api.mapbox.com/styles/v1/marylen/cjdkckp3xk0lf2skanpptt8wd/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA";
      return "https://api.mapbox.com/styles/v1/marylen/cjdkb4z9n2imi2rk654zwiz2x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA";
    }
    else if (!toggleValues[2])
      return "https://api.mapbox.com/styles/v1/marylen/cjdk6rqey2hla2tpdlzgdwe90/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA";
    return "https://api.mapbox.com/styles/v1/marylen/cjd2tk5q93pgs2so6d37pik1x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA";
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }

}


