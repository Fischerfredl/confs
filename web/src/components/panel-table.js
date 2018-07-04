import { LitElement, html } from '@polymer/lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { store } from '../store.js'

import { SharedStyles } from './shared-styles'

class PanelTable extends connect(store)(LitElement) {
  _render({ data }) {
    return html`
<style>
${SharedStyles}

:host {
    display: block;
    padding: 15px;
    max-width: 100%;
    box-sizing: border-box;
}

.table-wrapper {
    max-height: 40vh;
    overflow: auto;
}

table {
    border-collapse: collapse;
    width: 100%;
}

th, td {
    padding: 5px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    white-space: nowrap;
}

tr:hover {background-color: #f5f5f5;}

tr:nth-child(even) {background-color: #f2f2f2;}
</style>

<h2>Table</h2> 
<div class="table-wrapper">
    <table>
        <thead>
        ${tableHeader()}
        </thead>
        <tbody>
        ${data.map((conf) => confToTr(conf))}
        </tbody>
    </table>
</div>

`
  }

  static get properties() { return { data: Array } }
  _stateChanged(state) { this.data = state.data }

}

window.customElements.define('panel-table', PanelTable);

const attrToTd = (conf, attr) => conf[attr] ? html`<td>${conf[attr]}</td>` : html`<td> - </td>`
const linkToTd = (conf, attr) => conf[attr] ? html`<td><a href="${conf[attr]}" target="_blank">Link</a></td>` : html`<td> - </td>`

const tableHeader = () => {
  return html`
<tr>
<th>Name</th>
<th>Start</th>
<th>End</th>
<th>City</th>
<th>Country</th>
<th>Link</th>
<th>cfpStart</th>
<th>cfpEnd</th>
<th>cfpUrl</th>
</tr>
`
}

const confToTr = (conf) => {
  return html`
<tr>
    ${attrToTd(conf, 'taggedName')}  
    ${attrToTd(conf, 'start')}  
    ${attrToTd(conf, 'end')}  
    ${attrToTd(conf, 'city')}  
    ${attrToTd(conf, 'country')}  
    ${linkToTd(conf, 'url')}  
    ${attrToTd(conf, 'cfpStart')}  
    ${attrToTd(conf, 'cfpEnd')}  
    ${linkToTd(conf, 'cfpUrl')}  
</tr>`
}