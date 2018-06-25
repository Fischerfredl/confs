import { LitElement, html } from '@polymer/lit-element'

class PanelIntro extends LitElement {
  _render({ showIntro }) {
    return html`
<style>

:host {
    display: block;
    padding: 15px;
}

.content { 
    max-height: 0; 
    transition: all .5s ease-in;
    overflow: hidden;
}

.content[active] { max-height: ${this.calculateHeight()}px; }

#contentHeight { position: absolute; visibility: hidden; }

</style>

<h2>Welcome to muperconfs</h2>

<p>your personal conference calendar. <a href="toggle" on-click="${e => this.toggleIntro(e)}">${showIntro ? `read less`: `read more`}...</a></p>

<div id="content" class="content" active?="${showIntro === true}">
    <p><b>Description</b><br>This website lets you browse tech conferences around the globe. You can filter the dataset with the controls below. When you made a selection you like check out the Ical link. You can paste it to many calendar apps like <a href="https://calendar.google.com/calendar/" target="_blank">Google Calendar</a> to get an auto-updating schedule of tech conferences of your interests.</p>
    <p><b>The Data</b><br>The data source gets regulary pulled from <a href="https://github.com/tech-conferences/confs.tech" target="_blank">this</a> GitHub repo. Special thanks to the guys maintaining that repo &hearts;. I add some info by geocoding the city names and normalize some date strings. Check out my repository on GitHub (<a href="https://github.com/Fischerfredl/muperconfs">muperconfs</a>) if you are interested.</p>
    <p><b>The website<br></b>This website is made by Alfred Melch (me). I was interested in tech conferences and found the repo mentioned above. After playing around with a python script to get calendar files i spun up a webserver to make ical feeds. In the course of a university project (Geovisualization) I decided to make the data accessible and presentable via this website.</p>
    <p><b>Spotted mistakes? / Contributing:</b><br>If you find any mistakes on this page, do not hesitate to contact me by opening an Issue on my <a href="https://github.com/Fischerfredl/muperconfs/issues" target="_blank">Repository</a>. If there is any mistake on a specific Conference (except geolocation) consider filing the Issue to the <a href="https://github.com/tech-conferences/confs.tech" target="_blank">confs.tech</a> Repository containing the data source. If you are unhappy with this site you may check out their website <a href="https://confs.tech/" target="blank">confs.tech</a>. You can even file in new conferences to <a href="https://confs.tech/conferences/new" target="_blank">add</a> to their data</p></p>
    <p><b>Tipps and tricks</b><br>This website is a full blown PWA (Progressive Web App). You can add it to your homescreen if you are visiting from smart devices. The data is cached on your device allowing using this website even when offline. You can view the total count of selected conferences in the top-right corner.</p>
</div>
<div id="contentHeight">
    <p><b>Description</b><br>This website lets you browse tech conferences around the globe. You can filter the dataset with the controls below. When you made a selection you like check out the Ical link. You can paste it to many calendar apps like <a href="https://calendar.google.com/calendar/" target="_blank">Google Calendar</a> to get an auto-updating schedule of tech conferences of your interests.</p>
    <p><b>The Data</b><br>The data source gets regulary pulled from <a href="https://github.com/tech-conferences/confs.tech" target="_blank">this</a> GitHub repo. Special thanks to the guys maintaining that repo &hearts;. I add some info by geocoding the city names and normalize some date strings. Check out my repository on GitHub (<a href="https://github.com/Fischerfredl/muperconfs">muperconfs</a>) if you are interested.</p>
    <p><b>The website<br></b>This website is made by Alfred Melch (me). I was interested in tech conferences and found the repo mentioned above. After playing around with a python script to get calendar files i spun up a webserver to make ical feeds. In the course of a university project (Geovisualization) I decided to make the data accessible and presentable via this website.</p>
    <p><b>Spotted mistakes? / Contributing:</b><br>If you find any mistakes on this page, do not hesitate to contact me by opening an Issue on my <a href="https://github.com/Fischerfredl/muperconfs/issues" target="_blank">Repository</a>. If there is any mistake on a specific Conference (except geolocation) consider filing the Issue to the <a href="https://github.com/tech-conferences/confs.tech" target="_blank">confs.tech</a> Repository containing the data source. If you are unhappy with this site you may check out their website <a href="https://confs.tech/" target="blank">confs.tech</a>. You can even file in new conferences to <a href="https://confs.tech/conferences/new" target="_blank">add</a> to their data</p></p>
    <p><b>Tipps and tricks</b><br>This website is a full blown PWA (Progressive Web App). You can add it to your homescreen if you are visiting from smart devices. The data is cached on your device allowing using this website even when offline. You can view the total count of selected conferences in the top-right corner.</p>
</div>
`
  }

  constructor() {
    super()
    this.showIntro = false
  }

  static get properties() {
    return {
      showIntro: Boolean
    }
  }

  toggleIntro(e) {
    e.preventDefault()
    this.showIntro = !this.showIntro

  }

  calculateHeight() {
    let element = this._root.getElementById('contentHeight')

    return element ? element.clientHeight + 10 : 0
  }



}

window.customElements.define('panel-intro', PanelIntro)
