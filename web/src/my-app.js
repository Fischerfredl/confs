import { LitElement, html } from '@polymer/lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { installOfflineWatcher } from 'pwa-helpers/network.js'
import { installRouter } from 'pwa-helpers/router.js'
import { updateMetadata } from 'pwa-helpers/metadata.js'


class MyApp extends LitElement {
  _render() {

    return html`Hello World`
  }

  static get properties() {
    return {
    }
  }

  _firstRendered() {
    installRouter((location) => console.log(location))
    installOfflineWatcher((offline) => console.log(offline))
  }
}

window.customElements.define('my-app', MyApp);
