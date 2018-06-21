import { REQUEST_DATA, RECEIVE_DATA } from '../actions/data.js'

const data = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return action.data
    default:
      return state
  }
}

export default data
