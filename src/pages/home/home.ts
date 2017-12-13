import { DataProvider } from './../../providers/data/data';
import { AutocompleteProvider } from './../../providers/autocomplete/autocomplete';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
import { importType } from '@angular/compiler/src/output/output_ast';
import { clusterOptions, invisibleIcon, visibleIcon, skiIcon } from '../../app/cluster-settings';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { LatLng } from './../../app/interfaces';
// import { AngularFirestore } from 'angularfire2/firestore';
// declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  map: L.Map;
  markers: L.LayerGroup;
  activityMarkers: L.LayerGroup;
  suggestions: string[] = [];
  searchCircle: L.Circle;
  @ViewChild('map') mapDiv: ElementRef;
  @ViewChild('inputBar') inputBar: ElementRef;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public autoComplete: AutocompleteProvider,
    public db: AngularFireDatabase,
    private geolocation: Geolocation,
    public dataProvider: DataProvider) {
      this.activityMarkers = new L.LayerGroup();
    }
  
  async ngAfterViewInit() {
    await this.platform.ready()
    await this.loadMap();
    this.searchCircle = new L.Circle(this.map.getCenter(), { radius: 50000 })
    this.map.on('move', _ => this.searchCircle.setLatLng(this.map.getCenter()))

    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.map.panTo({ lat: resp.coords.latitude, lng: resp.coords.longitude })
    //   this.map.setZoom(14);
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
  }

  async loadMap(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.map = L.map('map', {
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

  setMapCenter(event: LatLng) {
    this.map.flyTo(event, 11)
  }

  onFabClick(): void {
    if(this.map.hasLayer(this.markers)) {
      this.map.removeLayer(this.markers)
      this.map.addLayer(this.searchCircle);
    }
    else {
      this.map.removeLayer(this.searchCircle)
      this.map.addLayer(this.markers)
    }  
  }

  onRangeChanged(event: any): void {
    this.searchCircle.setRadius(event._value * 1000)
  }

  onRangeBlur(event: any): void {
    this.dataProvider.getSkiStations(this.map.getCenter(), event._value)
    .subscribe(data => {
      console.log(data)
      this.activityMarkers.clearLayers();
      for(let point of data)
        this.activityMarkers.addLayer(new L.Marker((point), {icon: skiIcon}))
      this.map.addLayer(this.activityMarkers)  
    })
  }
}

