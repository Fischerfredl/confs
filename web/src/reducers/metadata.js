import { REQUEST_METADATA, RECEIVE_METADATA } from '../actions/metadata.js';

const initialState = {
  minYear: 2014,
  maxYear: 2025,
  countries: [],
  topics: ['javascript', 'python']
}

const metadata = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_METADATA:
      return { ...state, ...action.data }
    default:
      return state
  }
}

export default metadata;
