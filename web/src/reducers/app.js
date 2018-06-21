import { UPDATE_OFFLINE } from '../actions/app.js'

const app = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline
      };
    default:
      return state
  }
}

export default app
