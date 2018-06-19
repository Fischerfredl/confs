export const REQUEST_METADATA = 'REQUEST_METADATA'
export const RECEIVE_METADATA = 'RECEIVE_METADATA'

export const fetch_metadata = () => (dispatch) => {
  dispatch({ data: {}, type: REQUEST_METADATA })
  fetch('https://confs.muperfredi.de/query/meta')
    .then(res => res.ok ? res.json() : Promise.reject() )
    .then(data => dispatch({ data, type: RECEIVE_METADATA }))
    .catch(err => dispatch({ data: {}, type: RECEIVE_METADATA }))
}
