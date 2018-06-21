import { LitElement, html } from '@polymer/lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store.js'



class PanelTable extends connect(store)(LitElement) {
  _render({ data }) {
    return html`
<style>
:host {
    display: block;
    padding: 15px;
    max-height: 500px;
    overflow: auto;
}

table {
    border-collapse: collapse;
    width: 100%;
}

th, td {
    padding: 5px;
    border-bottom: 1px solid #ddd;
}

tr:hover {background-color: #f5f5f5;}

tr:nth-child(even) {background-color: #f2f2f2;}
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
  return html`<tr><td>${conf.name}</td></tr>`
}