# confs.muperfredi.de

This is a university project. The assignment was to visualize geodata. The data comes from the GitHub Repo [tech-conferences/confs.tech](https://github.com/tech-conferences/confs.tech).

# Overview

This project is split in four services: 
- Backend: Python flask server to aggregate and filter data
- Frontend: Polymer PWA
- Cache: redis
- Reverse proxy: nginx

todo: ping-service to keep cache fresh

Each service gets built as a docker container. Use `docker-compose up` to spin up the configured app.

## Rev proxy

Nginx is used as a reverse proxy to frontend and backend. Routes starting with "/query" will be served by the backend. All other will be routed to the frontend.  

## The Backend

The backend service gathers all data. It can filter the dataset by parameters and serve different formats. The following routes are exposed by the service:

    https://confs.muperfredi.de/query?<params>
    https://confs.muperfredi.de/query/meta
    
### Parameters

`topics=<topic>[,<topic>][,<topic>]...`: 
        
`startYear=<int>`

`endYear=<int>`

`country=<country>[,<country>][,<country>],...`

`bbox=<x1>,<y1>,<x2>,<y2>`

`format=[json|ical|geojson]`

todo: `include_cfp` to include cfp dates in ical

### topics and countries

Send a request to `https://confs.muperfredi.de/query/meta` to get a list of possible countries or topics to use.


### The code

Python [Flask](http://flask.pocoo.org/) is used for this service. The app is defined in `runserver.py`. Flask-CORS takes care of CORS headers to make cross origin requests possible. The server will always respond with a valid json response if no other format is requested.

todo: describe lib

## The cache

...

## Frontend

...
