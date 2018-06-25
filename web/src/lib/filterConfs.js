export default (data, settings) => {
  return data
    .filter((conf) => !settings.topics || settings.topics.length === 0 || settings.topics.indexOf(conf.topic) > -1)
    .filter((conf) => !settings.countries || settings.countries.length === 0 || settings.countries.indexOf(conf.country) > -1)
    .filter((conf) => !settings.excludePast || new Date().now < new Date(conf.endDate) )

}