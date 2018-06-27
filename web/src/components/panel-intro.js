import { LitElement, html } from '@polymer/lit-element'

import { SharedStyles } from './shared-styles'

class PanelIntro extends LitElement {
  _render({ showIntro, showFurther }) {
    return html`
<style>
${SharedStyles}
:host {
    display: block;
    padding: 15px;
}

.unfold { display: None; }
.unfold[active] { display: block; }

</style>

<h2>Welcome to muperconfs</h2>

<p>your personal conference calendar. <a href="toggle" on-click="${e => this.toggleIntro(e)}">${showIntro ? html`read less... &#x25B2;`: html`read more...&#x25BC`}</a></p>

<div class="unfold" active?="${showIntro === true}">
    <p><b>Description</b><br>This website lets you browse tech conferences around the globe. You can filter the dataset with the controls below. When you made a selection you like check out the Ical link. You can paste it to many calendar apps like <a href="https://calendar.google.com/calendar/" target="_blank">Google Calendar</a> to get an auto-updating schedule of tech conferences of your interests.</p>
    <p><b>Tipps and tricks</b><br>This website is a full blown PWA (Progressive Web App). You can add it to your homescreen if you are visiting from smart devices. The data is cached on your device allowing using this website even when offline. You can view the total count of selected conferences in the top-right corner. The markers in the map are clickable. You will get a popup with more info about the conference.</p>
    <a href="toggle" on-click="${e => this.toggleFurther(e)}">${showFurther ? html`read less... &#x25B2;`: html`read even more...&#x25BC`}</a>  
    </div>
    <div class="unfold" active?="${showFurther === true}">
    <p><b>The Data</b><br>The data source gets regulary pulled from <a href="https://github.com/tech-conferences/confs.tech" target="_blank">this</a> GitHub repo. Special thanks to the guys maintaining that repo &hearts;. I add some info by geocoding the city names and normalize some date strings. Check out my repository on GitHub (<a href="https://github.com/Fischerfredl/muperconfs">muperconfs</a>) if you are interested.</p>
    <p><b>The website<br></b>This website is made by Alfred Melch (me). I was interested in tech conferences and found the repo mentioned above. After playing around with a python script to get calendar files i spun up a webserver to make ical feeds. In the course of a university project (Geovisualization) I decided to make the data accessible and presentable via this website.</p>
    <p><b>Spotted mistakes? / Contributing:</b><br>If you find any mistakes on this page, do not hesitate to contact me by opening an Issue on my <a href="https://github.com/Fischerfredl/muperconfs/issues" target="_blank">Repository</a>. If there is any mistake on a specific Conference (except geolocation) consider filing the Issue to the <a href="https://github.com/tech-conferences/confs.tech" target="_blank">confs.tech</a> Repository containing the data source. If you are unhappy with this site you may check out their website <a href="https://confs.tech/" target="blank">confs.tech</a>. You can even file in new conferences to <a href="https://confs.tech/conferences/new" target="_blank">add</a> to their data</p></p>
</div>
`
  }

  constructor() {
    super()
    this.showIntro = false
    this.showFurther = false
  }

  static get properties() {
    return {
      showIntro: Boolean,
      showFurther: Boolean
    }
  }

  toggleIntro(e) {
    e.preventDefault()
    this.showIntro = !this.showIntro
    if (this.showIntro === false) { this.showFurther = false }
  }

  toggleFurther(e) {
    e.preventDefault()
    this.showFurther = !this.showFurther
  }



}

window.customElements.define('panel-intro', PanelIntro)
