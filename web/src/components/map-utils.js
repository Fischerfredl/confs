/* global L */

import { LitElement, html } from '@polymer/lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store.js'

import getMarker from '../lib/markers.js'


class MapUtils extends connect(store)(LitElement) {
  _render({ data }){
    this.refresh(data)
    return html``
  }

  constructor() {
    super()
    this.map = new L.Map('map', {
      center: [0, 20],
      zoom: 2,
      scrollWheelZoom: false,
      dragging: false
    })
    this.map.once('focus', () => this.map.scrollWheelZoom.enable())
    this.map.once('focus', () => this.map.dragging.enable())

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.markers = L.markerClusterGroup()
    this.map.addLayer(this.markers)
  }


  refresh(data) {
    let layer = L.layerGroup(data.map((conf) => L.marker(conf.coords, {icon: getMarker(conf.topic)}).bindPopup(confToPopup(conf))))

    this.markers.clearLayers()
    this.markers.addLayer(layer)
    this.panMap()

  }

  static get properties() {
    return {
      data: Array
    }
  }

  _stateChanged(state){
    this.data = state.data
    this.autozoom = state.app.autozoom

    this.panMap()
  }

  panMap() {
    if (this.autozoom && this.markers.getBounds().isValid()) {
      this.map.fitBounds(this.markers.getBounds())
    }
  }


}

customElements.define('map-utils', MapUtils)


const attrToLine = (conf, attr, attrName) => conf[attr] ? `<span>${attrName || attr}: ${conf[attr]}</span><br>` : ``

const confToPopup = (conf) => {
  return `
  <b>${conf.taggedName}</b><br>
  <span>start: ${conf.startDate}</span><br>
  <span>end: ${conf.endDate}</span><br>
  ${conf.url ? `<span><a href="${conf.url}" target="_blank">Link</a></span><br>` : ``}
  ${attrToLine(conf, 'city', 'City')}
  ${attrToLine(conf, 'country', 'Country')}
  ${attrToLine(conf, 'cfpStart')}
  ${attrToLine(conf, 'cfpEnd')}
  ${conf.cfpUrl ? `<span><a href="${conf.cfpUrl}" target="_blank">cfp Link</a></span><br>` : ``}
  
  `
}


