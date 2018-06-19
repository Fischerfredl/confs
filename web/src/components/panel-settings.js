import { LitElement, html } from '@polymer/lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store.js'
import { set_settings } from '../actions/settings.js'
import { get_data } from '../actions/data'

class PanelSettings extends connect(store)(LitElement) {
  _render() {
    return html`
<h1>Settings-Controller</h1> 
<button on-click="${e => this.reload()}">Load</button>
`
  }

  static get properties() {
    return {
    }
  }

  reload() {
    store.dispatch(get_data())
  }

  _firstRendered() {
    store.dispatch(set_settings())
  }

  _stateChanged(state) {
  }

}

window.customElements.define('panel-settings', PanelSettings);
