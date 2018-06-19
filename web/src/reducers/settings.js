import { SET_SETTINGS } from '../actions/settings.js';


const initState = {
  topics: [],
  countries: [],
  startYear: 2014,
  endYear: 2025
}

const settings = (state = initState, action) => {
  switch (action.type) {
    case SET_SETTINGS:
      return { ...state, settings : action.topics }
    default:
      return state
  }
}

export default settings
