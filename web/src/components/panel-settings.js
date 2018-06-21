import { LitElement, html } from '@polymer/lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store.js'
import { setTopics, setCountries, updateExcludePast } from '../actions/settings.js'
import { getData } from '../actions/data'

import './settings-topics.js'
import './settings-countries.js'

import queryString from '../lib/query_string.js'

class PanelSettings extends connect(store)(LitElement) {
  _render({_settings, topicList, countryList}) {
    return html`
<style>
:host {
    padding: 15px;
}

.flex {
    display: flex;
    flex-wrap: wrap;
}

.flex > *{
    flex: 1;
}

.exclude-past {
    display: flex;
    align-items: center;
    margin: 20px 0;
}

</style>

<div class="flex">
    <settings-topics topics="${topicList}" on-updateTopics="${e => { store.dispatch(setTopics(e.detail.selected))} }}"></settings-topics>
    <settings-countries countries="${countryList}" on-updateCountries="${e => { store.dispatch(setCountries(e.detail.selected))} }}"></settings-countries>
    
</div>
<div class="exclude-past">
    <mwc-checkbox on-click="${e => this.updateExcludePast(e)}"></mwc-checkbox>
    <label>Exclude past conferences</label>
</div>
`
  }

  constructor() {
    super()
    this.countryList = []
    this.topicList = []
  }

  static get properties() {
    return {
      _settings: Object,
      _metadata: Object,
      topicList: Array,
      countryList: Array
    }
  }

  _stateChanged(state) {
    this._settings = state.settings
    this._metadata = state.metadata

    this.updateTopics(state.metadata.topics)
    this.updateCountries(state.metadata.countries)
  }

  _didRender(properties, changeList) {
    if ('_settings' in changeList) {
      store.dispatch(getData())
    }
  }

  updateExcludePast(e) {
    store.dispatch(updateExcludePast(!e.target.checked))
  }


  updateTopics(topics) {
    const fetch_topic = (topic) => {
      return fetch('https://confs.muperfredi.de/query' + queryString({...this._settings, topics: [topic]}), {method: 'HEAD'})
        .then(res => res.headers.get('X-Total-Count'))
        .then(num => { return { topic, num } })
        .catch((err) => { return { topic } })
    }

    Promise.all(topics.map(topic => fetch_topic(topic)))
      .then(topicList => { this.topicList = topicList })

  }

  updateCountries(countries) {
    const fetch_topic = (country) => {
      return fetch('https://confs.muperfredi.de/query' + queryString({...this._settings, countries: [country]}), {method: 'HEAD'})
        .then(res => res.headers.get('X-Total-Count'))
        .then(num => { return { country, num: Number(num) } })
        .catch((err) => { return { country } })
    }

    Promise.all(countries.map(country => fetch_topic(country)))
      .then(countryList => { this.countryList = countryList})
  }



}

window.customElements.define('panel-settings', PanelSettings);
