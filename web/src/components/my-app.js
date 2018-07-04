import { LitElement, html } from '@polymer/lit-element'
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js'
import { installOfflineWatcher } from 'pwa-helpers/network.js'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store'
import { updateOffline } from '../actions/app'

import './map-utils'
import './panel-intro'
import './panel-settings'
import './panel-table'
import './panel-ical'
import './view-header'
import { getData } from '../actions/data'

class MyApp extends connect(store)(LitElement) {
  _render() {

    return html`

<style>
:host {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.grid {
    flex: 1;
    
    display: grid;
    grid-template-columns: 1fr 2fr;
      
    grid-template-areas:
        "intro intro"   
        "control-1 map"
        "control-2 map"
        "table table";
    
    grid-gap: 15px 15px;
    padding: 10px; 
    margin: 10px 0;
}

@media screen and (max-width: 900px) {
    .grid {
        grid-template-areas:   
            "intro intro"
            "control-1 control-1"
            "control-2 control-2"
            "map map"
            "table table";
    }
}

.grid > * {
    border: 2px solid black;
    border-radius: 15px;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}

panel-intro { grid-area: intro }
panel-settings { grid-area: control-1 }
panel-ical { grid-area: control-2}
panel-table { grid-area: table }
.map { grid-area: map; overflow: hidden }

#footer { 
    background-color: dimgrey;
    text-align: center;
}


</style>
<view-header></view-header>
<div class="grid">
    <panel-intro></panel-intro>
    <panel-settings></panel-settings>
    <panel-table></panel-table>
    <panel-ical></panel-ical>
    <div class="map"><slot name="map"></slot></div>
</div>

<map-utils></map-utils>
<div id="footer">Made by Alfred Melch</div>
    
    `
  }

  static get properties() {
    return {
    }
  }

  constructor() {
    super();
    setPassiveTouchGestures(true);
  }

  _firstRendered() {
    installOfflineWatcher((offline) => { store.dispatch(updateOffline(offline)) })
    store.dispatch(getData())
  }

  _stateChanged(state) {
  }
}

window.customElements.define('my-app', MyApp);
