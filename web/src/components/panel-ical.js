import { LitElement, html } from '@polymer/lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store.js'
import { SharedStyles } from './shared-styles'

import { updateIncludeCfp } from '../actions/settings'

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
<p>Copy and paste this link to your calendar app.</p>

<div class="content">
    <div class="flex">
        <input id="ical-link" type="text" value="https://confs.muperfredi.de/query${query}" disabled style="flex: 1">
        <button on-click="${e => this.copy(e)}">Copy</button>
    </div>
    <div class="flex">
        <mwc-checkbox on-click="${e => store.dispatch(updateIncludeCfp(!e.target.checked))}"></mwc-checkbox>
        <label>Include cfp</label>
    </div>
</div>
`
  }

  constructor() {
    super()
    this.includeCfp = false
  }

  static get properties() {
    return {
      query: String,
      includeCfp: Boolean
    }
  }

  _stateChanged(state) {
    this.query = queryString(state.settings, 'ical')
    this.includeCfp = state.settings.includeCfp
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
