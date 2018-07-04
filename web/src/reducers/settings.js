import {
  SET_TOPICS,
  SET_COUNTRIES,
  SET_FROM_DATE,
  DEL_FROM_DATE,
  SET_TO_DATE,
  DEL_TO_DATE,
  SET_EXCLUDE_PAST,
  DEL_EXCLUDE_PAST,
  SET_INCLUDE_CFP,
  DEL_INCLUDE_CFP} from '../actions/settings.js';


const settings = (state = {}, action) => {
  switch (action.type) {
    case SET_TOPICS:
      return { ...state, topics: action.topics }
    case SET_COUNTRIES:
      return { ...state, countries: action.countries }
    case SET_FROM_DATE:
      return { ...state, fromDate: action.date }
    case DEL_FROM_DATE:
      return { ...state, fromDate: undefined }
    case SET_TO_DATE:
      return { ...state, toDate: action.date }
    case DEL_TO_DATE:
      return { ...state, toDate: undefined }
    case SET_EXCLUDE_PAST:
      return { ...state, excludePast: true }
    case DEL_EXCLUDE_PAST:
      return { ...state, excludePast: false }
    case SET_INCLUDE_CFP:
      return { ...state, includeCfp: true }
    case DEL_INCLUDE_CFP:
      return { ...state, includeCfp: false }
    default:
      return state
  }
}

export default settings
