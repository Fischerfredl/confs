export const SET_SETTINGS = 'SET_SETTINGS'



export const set_settings = (settings) => (dispatch, getState) => {

  dispatch({settings, type: SET_SETTINGS})
}
