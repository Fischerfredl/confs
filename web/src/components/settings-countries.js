import { LitElement, html } from '@polymer/lit-element'

import '@material/mwc-checkbox'


class SettingsCountries extends LitElement {
  _render({ countries, selected, showCount }) {
    return html`
<style>
:host {
    display: block;
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


</style>

<h1>set countries</h1>

<ul> 
    ${countries.map((obj, index) => html`
        <li on-click="${e => this.update(obj.country)}" visible?="${index < showCount}">
            <mwc-checkbox id="${obj.country}" checked?="${selected.indexOf(obj.country) > -1}"></mwc-checkbox>
            ${obj.country}
            (${obj.num})
        </li>
`)}
</ul>
${this.showCount < countries.length ? html`<button on-click="${e => this.showCount += 5}">Show more</button>` : ``}
${this.showCount > 5 ? html`<button on-click="${e => this.showCount -= 5}">Show less</button>` : ``}

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

    this.dispatchEvent(new CustomEvent('updateCountries', { bubbles: true, composed: true, detail: { selected: this.selected } }))

  }

}

window.customElements.define('settings-countries', SettingsCountries);
