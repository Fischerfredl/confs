import { LitElement, html } from '@polymer/lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store.js'

import { logo } from './icons.js'

class Viewheader extends connect(store)(LitElement) {
  _render({ totalCount }) {
    return html`
<style>
:host {
    display: flex;
    align-items: center;
    
    height: 80px;
    
    background-color: sandybrown;
    border-bottom: 3px solid white;
    box-shadow: inset 0px 5px 6px -3px rgba(0, 0, 0, 0.4), 0px 5px 6px 0 rgba(0, 0, 0, 0.4);
}

.logo {
    height: 100%;
    margin: 0 20px;
}

.main {
    flex: 1;
    
}

.totalcount {
    width: 50px;
    padding: 10px 0;
    text-align: center;
    font-weight: bold;
    background-color: white;
    border: 3px solid black;
    border-radius: 10px;
    margin: 0 20px;
}

@media only screen and (max-width: 600px) {
    .title {
        font-size: 1.3em;
    }
}

@media only screen and (max-width: 450px) {
    .title {
        display: None;
    }
}


</style>
   
${logo}
<div class="main">
    <h1 class="title">Muperconfs</h1> 
</div>
<div>Total Count: </div>
<div class="totalcount">${totalCount}</div>
  
    `
  }

  static get properties() {
    return {
      totalCount: Number
    }
  }

  _stateChanged(state) {
    this.totalCount = state.data.length
  }

}

window.customElements.define('view-header', Viewheader);
