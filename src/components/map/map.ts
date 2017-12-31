import { DataProvider } from './../../providers/data/data';
import { StatusProvider } from './../../providers/status/status';

import { Component } from '@angular/core';
import { LatLng } from './../../models/interfaces';
import { SelectedActivity } from './../../models/enums';
import { clusterOptions, invisibleIcon, visibleIcon, skiIcon } from '../../app/cluster-settings';

import * as L from 'leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-draw';
import { Platform } from 'ionic-angular';

const maxZoom = 11;
const minZoom = 6;
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  map: L.Map;
  markers: L.LayerGroup;
  activityMarkers: L.LayerGroup;
  searchCircle: L.Circle;
  searchMarker: L.Marker;
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
    this.map.on('draw:created', _ => console.log('test'))
    this.circleDrawer = new L.Draw.Circle(this.map);
  }

  setObservables() {
    this.statusProvider.placeSelected.subscribe((latLng: LatLng) => this.map.flyTo(latLng, maxZoom))

    // this.statusProvider.activitySliderOpened.subscribe((isOpened: boolean) => {
    //   if(isOpened) {
    //     this.map.removeLayer(this.markers);
    //     this.map.addLayer(this.searchCircle);
    //   }
    //   else {
    //     this.map.removeLayer(this.searchCircle);
    //     this.map.removeLayer(this.activityMarkers);
    //     this.map.addLayer(this.markers);
    //   }
    // })

    this.statusProvider.activityPressed.subscribe(_ => {
      this.statusProvider.selectedActivity.subscribe((activity: SelectedActivity) => {
        if (activity != SelectedActivity.sun) {
          this.map.removeLayer(this.markers);
          this.circleDrawer.enable();
          // this.map.dragging.disable();
          // // this.map.addLayer(this.searchCircle);
          // this.map.once('click', _ => {
          //   // this.map.off('mousedown')
          //   console.log('clicked')
          //   this.map.on('mousemove', _ => {
          //     console.log('moving')
          //   })
          // })
          // this.map.once('mouseup', _ => {
          //   console.log('finished')
          //   this.map.off('mousemove')
          //   this.map.off('mouseup')
          //   this.map.dragging.enable()
          // })


        }
        else {
          // this.map.removeLayer(this.searchCircle);
          this.circleDrawer.disable();
          this.map.addLayer(this.markers);
        }
      })
    })



    this.statusProvider.rangeChanged.subscribe((range: number) => {
      this.searchCircle.setRadius(range * 1000);
    })

    this.statusProvider.activitySearched.subscribe(_ => {
      this.activityMarkers.clearLayers();
      this.dataProvider.getSkiStations(this.map.getCenter(), this.searchCircle.getRadius() / 1000)
        .subscribe(data => {
          for (let coord of data)
            this.activityMarkers.addLayer(new L.Marker((coord), { icon: skiIcon }))
          this.map.addLayer(this.activityMarkers);
        })
    })
  }
}


