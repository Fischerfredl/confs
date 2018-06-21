export const REQUEST_DATA = 'REQUEST_DATA'
export const RECEIVE_DATA = 'RECEIVE_DATA'

import queryString from '../lib/query_string.js'

export const getData = () => (dispatch, getState) => {
  dispatch({ data: {}, type: REQUEST_DATA })

  fetch('https://confs.muperfredi.de/query' + queryString(getState().settings))
    .then(res => res.ok ? res.json() : Promise.reject() )
    .then(data => dispatch({ data, type: RECEIVE_DATA }))
    .catch(err => dispatch({ data: [], type: RECEIVE_DATA }))
}
