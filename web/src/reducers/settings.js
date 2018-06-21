import {
  SET_TOPICS,
  SET_COUNTRIES,
  SET_FROM_DATE,
  DEL_FROM_DATE,
  SET_TO_DATE,
  DEL_TO_DATE,
  SET_EXCLUDE_PAST,
  DEL_EXCLUDE_PAST } from '../actions/settings.js';


const settings = (state = {}, action) => {
  switch (action.type) {
    case SET_TOPICS:
      return { ...state, topics: action.topics }
    case SET_COUNTRIES:
      return { ...state, countries: action.countries }
    case SET_FROM_DATE:
      return { ...state, fromDate: action.fromDate }
    case DEL_FROM_DATE:
      return { ...state, fromDate: undefined }
    case SET_TO_DATE:
      return { ...state, toDate: action.toDate }
    case DEL_TO_DATE:
      return { ...state, toDate: undefined }
    case SET_EXCLUDE_PAST:
      return { ...state, excludePast: true }
    case DEL_EXCLUDE_PAST:
      return { ...state, excludePast: false }
    default:
      return state
  }
}

export default settings
