import { LitElement, html } from '@polymer/lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store.js'
import { setTopics, setCountries } from '../actions/settings.js'
import { getData } from '../actions/data'

import './settings-topics.js'
import './settings-countries.js'

import queryString from '../lib/query_string.js'

class PanelSettings extends connect(store)(LitElement) {
  _render({_settings, orderedTopics, orderedCountries}) {
    return html`
<h1>Panel-Settings</h1>
<settings-topics topics="${orderedTopics}" on-updateTopics="${e => { store.dispatch(setTopics(e.detail.selected))} }}"></settings-topics>
<settings-countries countries="${orderedCountries}" on-updateCountries="${e => { store.dispatch(setCountries(e.detail.selected))} }}"></settings-countries>
`
  }

  constructor() {
    super()
    this.orderedTopics = []
    this.orderedCountries = []
  }

  static get properties() {
    return {
      _settings: Object,
      _metadata: Object,
      orderedTopics: Array,
      orderedCountries: Array
    }
  }

  _stateChanged(state) {
    this._settings = state.settings
    this._metadata = state.metadata

    this.orderTopics(state.metadata.topics)
    this.orderCountries(state.metadata.countries)
  }

  orderTopics(topics) {
    const fetch_topic = (topic) => {
      return fetch('https://confs.muperfredi.de/query' + queryString({...this._settings, topics: [topic]}), {method: 'HEAD'})
        .then(res => res.headers.get('X-Total-Count'))
        .then(num => { return { topic, num } })
        .catch((err) => { return { topic } })
    }

    Promise.all(topics.map(topic => fetch_topic(topic)))
      .then(unordered => {
        this.orderedTopics = unordered.sort((a, b) => b.num - a.num)})

  }

  orderCountries(countries) {
    const fetch_topic = (country) => {
      return fetch('https://confs.muperfredi.de/query' + queryString({...this._settings, countries: [country]}), {method: 'HEAD'})
        .then(res => res.headers.get('X-Total-Count'))
        .then(num => { return { country, num: Number(num) } })
        .catch((err) => { return { country } })
    }

    Promise.all(countries.map(country => fetch_topic(country)))
      .then(unordered => {
        let ordered = unordered
          .filter((obj) => obj.num !== 0)
          .sort((a, b) => b.num - a.num)
        this.orderedCountries = ordered})
  }


  _didRender(properties, changeList) {
    if ('_settings' in changeList) {
      console.log('changed')
      store.dispatch(getData())
    }
  }
}

window.customElements.define('panel-settings', PanelSettings);
