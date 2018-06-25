import { LitElement, html } from '@polymer/lit-element'

import '@material/mwc-checkbox'
import '@material/mwc-button'

import { SharedStyles } from './shared-styles'

class SettingsTopics extends LitElement {
  _render({ topics, selected, showCount, preventJumps }) {
    topics = topics.sort((a, b) => {
      if (!preventJumps && selected.indexOf(a.topic) > -1 && selected.indexOf(b.topic) === -1) {
        return -1
      }
      if (!preventJumps && selected.indexOf(a.topic) === -1 && selected.indexOf(b.topic) > -1) {
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

.topic-list {
    max-height: 30vh;
    overflow: auto;
}

</style>

<h3 style="flex: 1">Topics</h3>

<ul class="topic-list"> 
    ${topics.map((obj, index) => html`
        <li on-click="${e => { e.preventDefault(); this.update(obj.topic)}} " visible?="${index < showCount}">
            <mwc-checkbox id="${obj.topic}" checked?="${selected.indexOf(obj.topic) > -1}"></mwc-checkbox>
            ${obj.topic}
            (${obj.num})
        </li>
`)}
</ul>
<mwc-button class="w-100" raised onclick="${e => {if(!e.target.disabled){this.showCount += 5}}}" disabled?="${this.showCount >= topics.length}">Show more</mwc-button>
<mwc-button class="w-100" raised onclick="${e => {if(!e.target.disabled){this.showCount -= 5}}}" disabled?=${this.showCount <= 5}>Show less</mwc-button>
<hr>
<mwc-button class="w-100" raised on-click="${e => {this.selected = []; this.notify() }}">Reset</mwc-button>
${topics.length === 0 ? `Data not yet available`: ``}
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
      topics: Array,
      selected: Array,
      showCount: Number,
      preventJumps: Boolean
    }
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
    this.notify()
  }
  
  notify() {
    this.dispatchEvent(new CustomEvent('updateTopics', { bubbles: true, composed: true, detail: { selected: this.selected } }))
  }

}

window.customElements.define('settings-topics', SettingsTopics);
