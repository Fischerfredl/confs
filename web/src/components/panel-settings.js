import { LitElement, html } from '@polymer/lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import '@material/mwc-checkbox'
import '@material/mwc-button'

import { store } from '../store.js'
import { updateAutozoom } from '../actions/app.js'
import { setTopics, setCountries, updateExcludePast } from '../actions/settings.js'
import { filterData } from '../actions/data'

import './settings-topics.js'
import './settings-countries.js'

import filterConfs from '../lib/filterConfs.js'
import unique from '../lib/uniqueList.js'

import { SharedStyles } from './shared-styles'

class PanelSettings extends connect(store)(LitElement) {
  _render({showAdvanced}) {
    return html`
<style>
${SharedStyles}

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

.setting {
    display: flex;
    align-items: center;
    margin: 20px 0;
}

hr {
    margin: 20px -15px; 
}

.advanced { display: None; }
.advanced[active] { display: block; }



</style>
<h2>Settings</h2>
<hr>
<div class="flex">
    <settings-topics topics="${this.getTopicList()}" on-updateTopics="${e => { store.dispatch(setTopics(e.detail.selected))} }}"></settings-topics>
    <settings-countries countries="${this.getCountryList()}" on-updateCountries="${e => { store.dispatch(setCountries(e.detail.selected))} }}"></settings-countries>
    
</div>
<hr>


<mwc-button class="w-100" raised href="toggle" on-click="${e => this.toggleAdvanced(e)}">${showAdvanced ? `Hide` : `Show`} advanced options</mwc-button>
    
<div class="advanced" active?="${showAdvanced === true}">    
    <div class="setting">
        <mwc-checkbox on-click="${e => store.dispatch(updateAutozoom(!e.target.checked))}"></mwc-checkbox>
        <label>Automatically pan map to markers</label>
    </div>
    <div class="setting">
        <mwc-checkbox on-click="${e => store.dispatch(updateExcludePast(!e.target.checked))}"></mwc-checkbox>
    <label>Exclude past conferences</label>
</div>
</div>
`
  }

  constructor() {
    super()
    this.showAdvanced = false
  }

  static get properties() {
    return {
      _settings: Object,
      _dataCached: Boolean,
      showAdvanced: Boolean
    }
  }

  _stateChanged(state) {
    this._settings = state.settings
    this._dataCached = state.app.dataCached
  }

  _didRender(properties, changeList) {
    if ('_settings' in changeList) {
      store.dispatch(filterData())
    }
  }


  getTopicList() {
    let data = JSON.parse(window.sessionStorage.getItem('confs')) || []
    let topics = unique(data.map(conf => conf.topic))
    let topicList = []

    for(let key in topics) {
      let topic = topics[key]
      topicList.push({
        topic,
        num: filterConfs(data, { ...this._settings, topics: [topic] }).length
      })
    }
    return topicList
  }

  getCountryList() {
    let data = JSON.parse(window.sessionStorage.getItem('confs')) || []
    let countries = unique(data.map(conf => conf.country))
    let countryList = []

    for(let key in countries) {
      let country = countries[key]

      countryList.push({
        country,
        num: filterConfs(data, { ...this._settings, countries: [country]}).length
      })
    }
    return countryList
  }

  toggleAdvanced(e) {
    this.showAdvanced = !this.showAdvanced
  }

}

window.customElements.define('panel-settings', PanelSettings);
