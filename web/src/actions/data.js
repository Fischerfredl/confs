export const REQUEST_DATA = 'REQUEST_DATA'
export const RECEIVE_DATA = 'RECEIVE_DATA'

export const get_data = () => (dispatch, getState) => {
  dispatch({ data: {}, type: REQUEST_DATA })

  let queryString = '?'

  if(getState().settings.topics.length !== 0) {
    queryString += 'topics=' + ','.join(getState().settings.topics) + '&'
  }

  if(getState().settings.topics.length !== 0) {
    queryString += 'countries=' + ','.join(getState().settings.countries) + '&'
  }

  if(getState().settings.startYear) {
    queryString += 'startYear=' + getState().settings.startYear + '&'
  }

  if(getState().settings.endYear) {
    queryString += 'endYear=' + getState().settings.endYear + '&'
  }

  queryString += 'format=geojson'

  fetch('https://confs.muperfredi.de/query' + queryString)
    .then(res => res.ok ? res.json() : Promise.reject() )
    .then(data => dispatch({ data, type: RECEIVE_DATA }))
    .catch(err => dispatch({ data: [], type: RECEIVE_DATA }))
}
