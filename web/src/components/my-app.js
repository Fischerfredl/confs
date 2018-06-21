import { LitElement, html } from '@polymer/lit-element'
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js'
import { installOfflineWatcher } from 'pwa-helpers/network.js'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store'
import { fetch_metadata } from '../actions/metadata.js'
import { updateOffline } from '../actions/app'

import './map-utils'
import './panel-settings'
import './panel-table'

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
    grid-template-columns: 1fr 3fr;
      
    grid-template-areas:   
        "control-1 map"
        "control-2 map"
        "control-3 map"
        "table table";
    
    grid-gap: 10px 10px;
    padding: 10px;
    
    
}

.grid > * {
border-radius: 20px;
box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}

panel-settings { grid-area: control-1 }
panel-table { grid-area: table }

#footer { 
    background-color: dimgrey;
    text-align: center;
}



@media screen and (max-width: 900px) {
    .grid {
  
  grid-template-areas:   
    "control-1 control-1"
    "control-2 control-2"
    "map map"
    "control-3 control-3"
    "table table";
    
}
}



</style>
<div id="header" style="background-color: red; height: 100px">Header</div>
<div class="grid">

    <panel-settings></panel-settings>
    <panel-table></panel-table>
    <div id="control-3" style="background-color: chocolate; grid-area: control-3">Test2</div>
    <div id="table" style="background-color: chartreuse; grid-area: control-2">Test2</div>
    <div class="map" style="grid-area: map;">
        <slot name="map"></slot>
        <map-utils></map-utils>
    </div>
</div>
<div id="footer">Made by Alfred Melch</div>
    
    `
  }

  static get properties() {
    return {
    }
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/2.0/docs/devguide/gesture-events#use-passive-gesture-listeners
    setPassiveTouchGestures(true);
  }

  _firstRendered() {
    installOfflineWatcher((offline) => { store.dispatch(updateOffline(offline)) })
    store.dispatch(fetch_metadata())

  }

  _stateChanged(state) {

  }
}

window.customElements.define('my-app', MyApp);
