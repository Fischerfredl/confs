import logging
import requests

from lib.redis_cache import set_cache, get_cache


patches = {
    'Johannesburg, Sout': 'Johannisburg',
    'Sydney, Melbourne, Brisbane': 'Sydney',
    'Clear Water, Florida': 'Clear Water',
    'Dornbirn & Lech': 'Dornbirn'
}


def nominatim_geocode(query):
    params = {
        'q': query,
        'format': 'json',
        'limit': '1'
    }
    headers = {
        'Accept-Language': 'en-US,en;q=0.9'
    }

    r = requests.get('https://nominatim.openstreetmap.org/search', params=params, headers=headers)
    r.raise_for_status()

    return r.json()


def geocode_conference(conf):
    city = conf.get('city')
    country = conf.get('country')

    cache_key = f'query-v3.0-{country}-{city}'
    cached = get_cache(cache_key)
    if cached is not None:
        return cached

    # fix cases where no results were returned due to typos
    city = patches.get(city) or city

    # try geocoding
    data = nominatim_geocode(city + ', ' + country)
    if len(data) == 0:
        data = nominatim_geocode(city)

    if len(data) == 0:
        # failed
        logging.warning('{}-{}: Geocoding failed for: {}. Location: {}'
                        .format(conf['year'], conf['topic'], conf['name'], cache_key))
        coords = {
            'lat': '0',
            'lon': '0'
        }
        # do not set cache
        return coords

    else:
        # success
        coords = {
            'lat': data[0]['lat'],
            'lon': data[0]['lon']
        }

        set_cache(cache_key, coords)
        return coords
