import { LitElement, html } from '@polymer/lit-element'

import '@material/mwc-checkbox'


class SettingsTopics extends LitElement {
  _render({ topics, selected, showCount }) {
    return html`
<style>
:host {
    display: block;
    min-width: 160px;
    max-height: 40vh;
    overflow: auto;
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

</style>

<h2>Topics</h2>

<ul> 
    ${topics.map((obj, index) => html`
        <li on-click="${e => this.update(obj.topic)}" visible?="${index < showCount}">
            <mwc-checkbox id="${obj.topic}" checked?="${selected.indexOf(obj.topic) > -1}"></mwc-checkbox>
            ${obj.topic}
            (${obj.num})
        </li>
`)}
</ul>
${this.showCount < topics.length ? html`<button on-click="${e => this.showCount += 5}">Show more</button>` : ``}
${this.showCount > 5 ? html`<button on-click="${e => this.showCount -= 5}">Show less</button>` : ``}

${topics.length === 0 ? `Data not yet available`: ``}
`
  }

  constructor () {
    super()
    this.selected = []
    this.showCount = 5
  }

  static get properties() {
    return {
      topics: Array,
      selected: Array,
      showCount: Number }
  }

  update(topic) {
    let checked = this._root.getElementById(topic).checked
    // console.log(checked)

    if (checked) {
      // remove element from selected
      this.selected = this.selected.filter(obj => obj !== topic)

    }
    else {
      // add element to selected
      if (this.selected.indexOf(topic) === -1) {
        this.selected = [...this.selected, topic]
      }
    }

    this.dispatchEvent(new CustomEvent('updateTopics', { bubbles: true, composed: true, detail: { selected: this.selected } }))

  }

}

window.customElements.define('settings-topics', SettingsTopics);
