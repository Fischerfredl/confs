export const SET_TOPICS = 'SET_TOPICS'
export const SET_COUNTRIES = 'SET_COUNTRIES'
export const SET_FROM_DATE = 'SET_FROM_DATE'
export const DEL_FROM_DATE = 'DEL_FROM_DATE'
export const SET_TO_DATE = 'SET_TO_DATE'
export const DEL_TO_DATE = 'DEL_TO_DATE'
export const SET_EXCLUDE_PAST = 'SET_EXCLUDE_PAST'
export const DEL_EXCLUDE_PAST = 'DEL_EXCLUDE_PAST'

export const setTopics = (topics) => {
  if (Array.isArray(topics)){
    return { topics, type: SET_TOPICS }
  }
  console.warn('tried to pass non Array to settings.topics')
}

export const setCountries = (countries) => {
  if (Array.isArray(countries)) {
    return {countries, type: SET_COUNTRIES}
  }
  console.warn('tried to pass non Array to settings.countries')
}

export const updateExcludePast = (exclude_past) => {
  return exclude_past ? { type: SET_EXCLUDE_PAST } :  { type: DEL_EXCLUDE_PAST }
}

export const updateFromDate = (enabled, date) => {
  return enabled && !isNaN(Date.parse(date)) ? { date, type: SET_FROM_DATE } : { type: DEL_FROM_DATE }
}

export const updateToDate = (enabled, date) => {
  return enabled && !isNaN(Date.parse(date)) ? { date, type: SET_TO_DATE } : { type: DEL_TO_DATE } }