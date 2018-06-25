import { LitElement, html } from '@polymer/lit-element'

import '@material/mwc-checkbox'
import '@material/mwc-button'

import { SharedStyles} from './shared-styles'

class SettingsCountries extends LitElement {
  _render({ countries, selected, showCount, preventJumps }) {
    let sortedCountries = countries.sort((a, b) => {
      if (!preventJumps && selected.indexOf(a.country) > -1 && selected.indexOf(b.country) === -1) {
        return -1
      }
      if (!preventJumps && selected.indexOf(a.country) === -1 && selected.indexOf(b.country) > -1) {
        return 1
      }
      return b.num - a.num
    })

    return html`
<style>
${SharedStyles}

:host {
    display: block;
    min-width: 140px;
    margin: 0 20px;
}

ul {
    padding-left: 0;
}

li {
    display: None;
}

li[visible] {
    display: flex; 
    align-items: center;
}


li:hover {
    background-color: #dddddd;
    cursor: pointer;
}

.country-list {
    max-height: 30vh;
    overflow: auto;
}

</style>

<h3 style="flex: 1">Countries</h3>
    
<ul class="country-list"> 
    ${sortedCountries.map((obj, index) => html`
        <li on-click="${e => { e.preventDefault(); this.update(obj.country)}}" visible?="${index < showCount}">
            <mwc-checkbox id="${obj.country}" checked?="${selected.indexOf(obj.country) > -1}"></mwc-checkbox>
            ${obj.country}
            (${obj.num})
        </li>
`)}
</ul>
<mwc-button class="w-100" raised onclick="${e => {if(!e.target.disabled){this.showCount += 5}}}" disabled?="${this.showCount >= countries.length}">Show more</mwc-button>
<mwc-button class="w-100" raised onclick="${e => {if(!e.target.disabled){this.showCount -= 5}}}" disabled?=${this.showCount <= 5}>Show less</mwc-button>
<hr>
<mwc-button class="w-100" raised on-click="${e => {this.selected = []; this.notify(); }}">Reset</mwc-button>

${countries.length === 0 ? `Data not yet available`: ``}
`
  }

  constructor () {
    super()
    this.selected = []
    this.showCount = 5
    this.preventJumps = false
  }

  static get properties() {
    return {
      countries: Array,
      selected: Array,
      showCount: Number,
      preventJumps: Boolean
    }
  }

  update(country) {
    let checked = this._root.getElementById(country).checked

    if (checked) {
      // remove element from selected
      this.selected = this.selected.filter(obj => obj !== country)

    }
    else {
      // add element to selected
      if (this.selected.indexOf(country) === -1) {
        this.selected = [...this.selected, country]
      }
    }
    this.notify()
  }

  notify() {
    this.dispatchEvent(new CustomEvent('updateCountries', { bubbles: true, composed: true, detail: { selected: this.selected } }))
  }

}

window.customElements.define('settings-countries', SettingsCountries);
