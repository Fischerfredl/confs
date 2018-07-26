# confs.muperfredi.de

This is a university project. The assignment was to visualize geodata. The data comes from the GitHub Repo [tech-conferences/confs.tech](https://github.com/tech-conferences/confs.tech).

# Overview

This project is split in five services: 
- Backend: Python flask server to aggregate and filter data
- Frontend: PWA (Progressive Web App)
- Cache/database: redis
- Reverse proxy: nginx
- Ping-service: keep cache fresh

Each service gets defined as a docker container. Use `docker-compose up` to spin up the configured app.


![overview-schema](https://user-images.githubusercontent.com/2673788/42551280-c3ac85ce-84d6-11e8-8f4b-3ac042c2946f.jpg)

# The Services explained

A detailled description of the services follows. 

## The reverse-proxy service

Nginx is used as a reverse proxy to frontend and backend. Routes starting with "/query" will be served by the backend. All other requests will be routed to the frontend.  

This service only consists of two configuration files. `nginx.conf` is a general configuration file for nginx. The routing logic is described in `proxy.conf`. 

## The backend service

The backend service gathers all data. It can filter the dataset by parameters and serve different formats. The following routes are exposed by the service:

    https://confs.muperfredi.de/query?<params>
    https://confs.muperfredi.de/query/meta
    
Flask-CORS takes care of CORS headers to make cross origin requests possible. The server will always respond with a valid json response if no other format is requested. X-Total-Count is a custom header added to describe the amount of conferences returned. This is useful for HEADER-requests.

A detailled explanation of the datasource and the processing follows in a separate section.

### Query parameters

This section describes the possible request parameters and their effect. It can be seen as an API-specification.

**filtering data**

`topics=<topic>[,<topic>][,<topic>]...`: 

Limit the query to specific topics.
        
`startYear=<int>`

`endYear=<int>`

Limits the query to specific years given as integer value. This option is given since the data source is structured by year.

`fromDate=YYYY-MM-DD`

`toDate=YYYY-MM-DD`

Limit the query by dates.

`excludePast=[true|false]`

Exclude conferences which endDate lies in the past. 

`countries=<country>[,<country>][,<country>],...`

Limit the query to specific countries.

`bbox=<x1>,<y1>,<x2>,<y2>`

Limit the query by bounding box.

**output format**

`format=[json|ical|geojson]`

Output format of requested conferences. ical presentation can be used for calendars. Default: json

`includeCfp=[true|false]`

Only if format is `ical`. By default cfp is not included in ical representation.

**topics and countries**

Send a request to `https://confs.muperfredi.de/query/meta` to get a list of possible countries or topics to use.

### Examples

* https://confs.muperfredi.de/query - All conferences
* https://confs.muperfredi.de/query?topics=python - All python conferences
* https://confs.muperfredi.de/query?topics=javascript,ruby&excludePast=true - All upcoming javascript and ruby conferences
* https://confs.muperfredi.de/query?topics=android&fromDate=2018-07-01&toDate=2018-08-01 - All android conferences in July 2018
* https://confs.muperfredi.de/query?topics=ux,ios&countries=Germany,Austria,Switzerland&format=geojson - All ux and ios conferences in DACH countries as geojson
* https://confs.muperfredi.de/query?bbox=-26.7879539301,34.2493529429,51.5665382574,72.2543892796&format=geojson - All european conferences by bounding box
* https://confs.muperfredi.de/query?bbox=66.1783546637,-12.1077118784,156.5299171637,54.6333703447&format=ical - A calendar for eastern asian confereces

## The cache service

There are four types of cached resources. The resources are stored as stringified json:

* geocoding: Geolocation for geocoded city names will be cached indefinitely
* data source: requests to the confs.tech repository will be cached by year and topic for 4 hours
* processing: The data processing described above will be cached by year and topic for 30 minutes
* requests: Every request gets cached for 5 minutes. The key is a sha1 hash of the query string.

In this case the redis cache functions like a database. However an in-memory database was used for the following reasons. Faster retrieval: A full blown database is not needed for this kind of data. The dataset is rather small so it fits well in memory where it can be fetched faster than from disk. Simple configuration: The setup used requires no configuration of the cache-service. Statelessness: The redis cache can be setup an any machine and will be filled by the backend application on runtime. Thus there is no need to maintain state in the form of persistent storage making it possible to deploy the application independent of the infrastructure.


## The frontend service

![full](https://user-images.githubusercontent.com/2673788/43255156-58b7decc-90c9-11e8-9e03-b426dc57f38f.jpg)

The following technologies were used:
* [Lit-Element](https://github.com/Polymer/lit-element) - WebComponents/ShadowDOM wrapper.
* [PWA-starter-kit](https://github.com/Polymer/pwa-starter-kit) - Service Worker (Polymer CLI), PRPL-server 
* [redux](https://redux.js.org/) - state management
* [Leaflet](https://leafletjs.com/reference-1.3.0.html) - map API

Since all assets are cached, the PWA is usable with no network connection. The list of all conferences is stored in session storage on page request. All filtering is done on the frontend to save network requests.

The geovisualization is done in `web/src/components/map-utils.js`. The file contains the logic to refresh the map on data change and build appropiate popups for each conference. The custom markers are hand-crafted and stored in `web/images/marker`. 

As of 2018-07-26 the total count of conferences is 1329. Displaying each of these conferences as a marker on the map slows down the page significantly. So the leaflet plugin `leaflet.markercluster` was used to cluster groups of conferences on a lower zoom level. It also enables to view multiple conferences placed on the same coordinate by opening them up in a spiral form on click:

![marker spiral](https://user-images.githubusercontent.com/2673788/43255012-f3b21826-90c8-11e8-8dbe-ab420382c80b.png)


# Data source 

The data is stored in [this](https://github.com/tech-conferences/conference-data) GitHub repo. The conferences are stored in files of the following format: `<year>/<topic>.json`.

Original Schema

```json
  {
    "name": "",
    "url": "",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "city": "",
    "country": "",
    "cfpUrl": "",
    "cfpEndDate": "",
    "twitter": ""
  }
```

Some fields are added to get the following muperconfs schema. The data can now be retrieved as a single list of all conferences:

```json
  {
    "name": "",
    "url": "",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "city": "",
    "country": "",
    "cfpUrl": "",
    "cfpEndDate": "",
    "twitter": "",
    "id": "<SHA1 hash of {year}|{topic}|{name}|{date}|{city}>",
    "year": 2014,
    "topic": "",
    "topicFullname": "",
    "taggedName": "[Topic] Name",
    "coords": {"lat": 0, "lon": 0}
  }
```

# Lessons learned

By trying to take as much load as possible from the frontend a custom header `X-Total-Count` was added to the servers response containing the number of returned conferences. The idea was to use HEAD requests to gain information on how a filter would affect the number of conferences returned. This information can be used to show the topics or countries with most conferences on top of the lists. However this information had to be recalculated on any change of filters. Even though the size of HEAD-requests is only in the order of a few Bytes the amount of request led to a significant delay of user interaction to updating the view. Especially on a slow 3G network users would experience sudden jumps of the filtering lists seconds after their input. The solution was to retrieve the full list of all topics only and implement the filtering in the frontend too. This also optimizes caching, since only a single ressource is used. The backend filtering can still be used by external applications like the calendars.