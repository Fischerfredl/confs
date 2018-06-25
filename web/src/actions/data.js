export const REQUEST_DATA = 'REQUEST_DATA'
export const RECEIVE_DATA = 'RECEIVE_DATA'

import queryString from '../lib/queryString.js'
import filterConfs from '../lib/filterConfs.js'


export const getData = () => (dispatch, getState) => {
  dispatch({ data: {}, type: REQUEST_DATA })

  fetch('https://confs.muperfredi.de/query' + queryString(getState().settings))
    .then(res => res.ok ? res.json() : Promise.reject() )
    .then(data => {
      dispatch({ data, type: RECEIVE_DATA })
      window.sessionStorage.setItem('confs', JSON.stringify(data))
    })
    .catch(err => dispatch({ data: [], type: RECEIVE_DATA }))
}

export const filterData = () => (dispatch, getState) => {
  let data = JSON.parse(window.sessionStorage.getItem('confs')) || []
  dispatch({ data: filterConfs(data, getState().settings), type: RECEIVE_DATA})
}