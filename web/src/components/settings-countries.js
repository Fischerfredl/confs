import { LitElement, html } from '@polymer/lit-element'

import '@material/mwc-checkbox'


class SettingsCountries extends LitElement {
  _render({ countries, selected, showCount }) {
    let sortedCountries = countries.sort((a, b) => {
      if (selected.indexOf(a.country) > -1 && selected.indexOf(b.country) === -1) {
        return -1
      }
      if (selected.indexOf(a.country) === -1 && selected.indexOf(b.country) > -1) {
        return 1
      }
      return b.num - a.num
    })

    return html`
<style>
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

<div style="display: flex; align-items: center"><h3 style="flex: 1">Countries</h3><button on-click="${e => {this.selected = []; this.notify(); }}">Reset</button></div>


<ul class="country-list"> 
    ${sortedCountries.map((obj, index) => html`
        <li on-click="${e => { e.preventDefault(); this.update(obj.country)}}" visible?="${index < showCount}">
            <mwc-checkbox id="${obj.country}" checked?="${selected.indexOf(obj.country) > -1}"></mwc-checkbox>
            ${obj.country}
            (${obj.num})
        </li>
`)}
</ul>
${this.showCount < countries.length ? html`<button on-click="${e => this.showCount += 5}">Show more</button>` : ``}
${this.showCount > 5 ? html`<button on-click="${e => this.showCount -= 5}">Show less</button>` : ``}

${countries.length === 0 ? `Data not yet available`: ``}
`
  }

  constructor () {
    super()
    this.selected = []
    this.showCount = 5
  }

  static get properties() {
    return {
      countries: Array,
      selected: Array,
      showCount: Number
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
