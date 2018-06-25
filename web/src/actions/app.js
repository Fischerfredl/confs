export const UPDATE_OFFLINE = 'UPDATE_OFFLINE'
export const UPDATE_AUTOZOOM = 'UPDATE_AUTOZOOM'

export const updateOffline = (offline) => { return { type: UPDATE_OFFLINE, offline } }
export const updateAutozoom = (autozoom) => { return { type: UPDATE_AUTOZOOM, autozoom } }
