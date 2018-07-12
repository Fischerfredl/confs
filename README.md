# confs.muperfredi.de

This is a university project. The assignment was to visualize geodata. The data comes from the GitHub Repo [tech-conferences/confs.tech](https://github.com/tech-conferences/confs.tech).

# Overview

This project is split in five services: 
- Backend: Python flask server to aggregate and filter data
- Frontend: PWA
- Cache: redis
- Reverse proxy: nginx
- Ping-service: keep cache fresh

Each service gets built as a docker container. Use `docker-compose up` to spin up the configured app.


![overview-schema](https://user-images.githubusercontent.com/2673788/42551280-c3ac85ce-84d6-11e8-8f4b-3ac042c2946f.jpg)

# Rev proxy

Nginx is used as a reverse proxy to frontend and backend. Routes starting with "/query" will be served by the backend. All other requests will be routed to the frontend.  

# The Backend

The backend service gathers all data. It can filter the dataset by parameters and serve different formats. The following routes are exposed by the service:

    https://confs.muperfredi.de/query?<params>
    https://confs.muperfredi.de/query/meta
    
## Parameters

### Query parameters

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

### Output parameters

`format=[json|ical|geojson]`

Output format of requested conferences. ical presentation can be used for calendars. Default: json

`includeCfp=[true|false]`

Only if format is `ical`. By default cfp is not included in ical representation.

### topics and countries

Send a request to `https://confs.muperfredi.de/query/meta` to get a list of possible countries or topics to use.

### Examples

* https://confs.muperfredi.de/query - All conferences
* https://confs.muperfredi.de/query?topics=python - All python conferences
* https://confs.muperfredi.de/query?topics=javascript,ruby&excludePast=true - All upcoming javascript and ruby conferences
* https://confs.muperfredi.de/query?topics=android&fromDate=2018-07-01&toDate=2018-08-01 - All android conferences in July 2018
* https://confs.muperfredi.de/query?topics=ux,ios&countries=Germany,Austria,Switzerland&format=geojson - All ux and ios conferences in DACH countries as geojson
* https://confs.muperfredi.de/query?bbox=-26.7879539301,34.2493529429,51.5665382574,72.2543892796&format=geojson - All european conferences by bounding box
* https://confs.muperfredi.de/query?bbox=66.1783546637,-12.1077118784,156.5299171637,54.6333703447&format=ical - A calendar for eastern asian confereces

## Data source 

The data is stored in [this](https://github.com/tech-conferences/confs.tech) GitHub repo. The conferences are structured by `<year>/<topic>.json` files.

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

I add some fields to get the following muperconfs schema. The data can now be retrieved as a single list of all conferences:

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

## API usage

Flask-CORS takes care of CORS headers to make cross origin requests possible. The server will always respond with a valid json response if no other format is requested. X-Total-Count is a custom header added to describe the amount of conferences returned. This is useful for HEADER-requests.


# The cache

There are four types of cached resources. The resources are stored as stringified json:

* geocoding: Geolocation for geocoded city names will be cached indefinitely
* data source: requests to the confs.tech repository will be cached by year and topic for 4 hours
* processing: The data processing described above will be cached by year and topic for 30 minutes
* requests: Every request gets cached for 5 minutes. The key is a sha1 hash of the query string.


# Frontend

Technologies used:
* [Lit-Element](https://github.com/Polymer/lit-element) - WebComponents
* [PWA-starter-kit](https://github.com/Polymer/pwa-starter-kit) - Service Worker (Polymer CLI), PRPL-server 
* [redux](https://redux.js.org/) - state management
* [Leaflet](https://leafletjs.com/reference-1.3.0.html) - MAP API

Since all assets are cached, the PWA is usable with no network connection. The list of all conferences is stored in session storage on page request. All filtering is done on the frontend to save network requests.
