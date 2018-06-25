import { UPDATE_OFFLINE, UPDATE_AUTOZOOM, UPDATE_DATA_CACHED } from '../actions/app.js'

const app = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline
      }
    case UPDATE_AUTOZOOM:
      return {
        ...state,
        autozoom: action.autozoom
      }
    case UPDATE_DATA_CACHED:
      return {
        ...state,
        dataCached: action.dataCached
      }
    default:
      return state
  }
}

export default app
