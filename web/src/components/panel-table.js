import { LitElement, html } from '@polymer/lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store.js'



class PanelTable extends connect(store)(LitElement) {
  _render({ data }) {
    return html`
<style>
:host {
    display: block;
    max-height: 500px;
    overflow: scroll;
}
</style>

<h1>Table</h1> 
<table>
    ${data.map((conf) => confToTr(conf))}

</table>

`
  }

  static get properties() { return { data: Array } }
  _stateChanged(state) { this.data = state.data }

}

window.customElements.define('panel-table', PanelTable);

const confToTr = (conf) => {
  return html`<tr><td>${conf.taggedName}</td></tr>`
}