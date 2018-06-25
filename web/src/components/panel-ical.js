import { LitElement, html } from '@polymer/lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store.js'
import { SharedStyles } from './shared-styles'

import queryString from '../lib/queryString.js'

class PanelIcal extends connect(store)(LitElement) {
  _render({ query }) {
    return html`
<style>
${SharedStyles}
:host {
    display: block;
    padding: 15px;
}

.content > * { flex: 1; }

.flex {
    display: flex;
    align-items: center;
}

</style>

<h2>Ical link</h2>

<div class="content">
    <div class="flex">
        <input id="ical-link" type="text" value="https://confs.muperfredi.de/query${query}" disabled style="flex: 1">
        <button on-click="${e => this.copy(e)}">Copy</button>
    </div>
    <div class="flex">
        <mwc-checkbox disabled></mwc-checkbox>
        <label>Include cfp (not implemented yet)</label>
    </div>
</div>
`
  }

  static get properties() {
    return {
      query: String,
      includeCfp: Boolean
    }
  }

  _stateChanged(state) {
    this.query = queryString(state.settings, 'ical')
  }

  copy() {
    let text = this._root.getElementById('ical-link')
    text.disabled = false
    text.focus()
    text.select()
    text.disabled = true
    document.execCommand('copy')
  }

}

window.customElements.define('panel-ical', PanelIcal)
