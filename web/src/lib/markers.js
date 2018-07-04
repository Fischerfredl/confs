const iconTemplate = {
  iconUrl: 'leaf-green.png',

  iconSize:     [64, 64], // size of the icon
  shadowSize:   [50, 64], // size of the shadow
  iconAnchor:   [32, 64], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
}

const markerDict = {
  'android': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-android.png'}),
  'css': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-css.png'}),
  'data': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-data.png'}),
  'devops': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-devops.png'}),
  'elixir': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-elixir.png'}),
  'general': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-general.png'}),
  'golang': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-golang.png'}),
  'ios': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-ios.png'}),
  'javascript': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-javascript.png'}),
  'php': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-php.png'}),
  'python': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-python.png'}),
  'ruby': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-ruby.png'}),
  'rust': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-rust.png'}),
  'security': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-security.png'}),
  'tech-comm': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-tech-comm.png'}),
  'ux': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-ux.png'}),
  'default': L.icon({...iconTemplate, iconUrl: 'images/marker/marker-default.png'})
}

const getMarker = (topic) => markerDict[topic] || markerDict.default

export default getMarker
