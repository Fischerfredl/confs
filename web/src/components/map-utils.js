/* global L */

import { LitElement, html } from '@polymer/lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store} from '../store.js'

class MapUtils extends connect(store)(LitElement) {
  _render({ data }){
    this.refresh(data)
    return ``
  }

  constructor() {
    super()
    this.map = new L.Map('map', {
      center: [0, 20],
      zoom: 2
    })

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.markers = L.markerClusterGroup()
    this.map.addLayer(this.markers)
  }


  refresh(data) {
    this.markers.clearLayers()
    this.markers.addLayer(L.geoJson(data))
  }

  static get properties() {
    return {
      data: Object
    }
  }

  _stateChanged(state){
    this.data = state.data
  }


}

customElements.define('map-utils', MapUtils)