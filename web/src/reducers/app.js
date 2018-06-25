import { UPDATE_OFFLINE, UPDATE_AUTOZOOM } from '../actions/app.js'

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
    default:
      return state
  }
}

export default app
