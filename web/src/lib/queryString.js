/**
 * Function for transforming a settings object to query string *
 */


const queryString = (settings, format='json') => {
  let params = '?'

  if(settings.topics !== undefined && settings.topics.length !== 0) {
    params += 'topics=' + settings.topics.join(',') + '&'
  }

  if(settings.countries !== undefined && settings.countries.length !== 0) {
    params += 'countries=' + settings.countries.join(',') + '&'
  }

  if(settings.fromDate) {
    params += 'fromDate=' + settings.fromDate + '&'
  }

  if(settings.toDate) {
    params += 'toDate=' + settings.toDate + '&'
  }

  if(settings.excludePast) {
    params += 'excludePast=true&'
  }

  if(settings.includeCfp) {
    params += 'includeCfp=true&'
  }

  params += 'format=' + format

  return params
}

export default queryString
