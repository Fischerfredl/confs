import { LitElement, html } from '@polymer/lit-element'
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js'
import { installOfflineWatcher } from 'pwa-helpers/network.js'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store'
import { fetch_metadata } from '../actions/metadata.js'

import './map-utils'
import './panel-settings'

class MyApp extends connect(store)(LitElement) {
  _render() {

    return html`

<style>
:host {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.map {
    min-height: 300px;
}

.grid {
    flex: 1;
    
    display: grid;
    grid-template-columns: 1fr 3fr;
    
    min-height: 85vh;
  
    grid-template-areas:   
        "control-1 map"
        "control-2 map"
        "control-3 map"
        "table map";
    
    grid-gap: 10px 10px;
    padding: 10px;
    
    
}

.grid > * {
border-radius: 20px;
box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}

panel-settings { grid-area: control-1 }


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
    <div id="control-2" style="background-color: crimson; grid-area: control-2">Test2</div>
    <div id="control-3" style="background-color: chocolate; grid-area: control-3">Test2</div>
    <div id="table" style="background-color: chartreuse; grid-area: table">Test2</div>
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

  _firstRendered() {
    installOfflineWatcher((offline) => { /*console.log(offline)*/ })
    store.dispatch(fetch_metadata())

  }

  _stateChanged(state) {

  }
}

window.customElements.define('my-app', MyApp);
