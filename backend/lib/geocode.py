import logging
import requests
import time

from lib.redis_cache import set_cache, get_cache


patches = {
    'Johannesburg, Sout': 'Johannisburg',
    'Seoul, Sout': 'Seoul',
    'Prague, Czec': 'Prague',
    'Sydney, Melbourne, Brisbane': 'Sydney',
    'Clear Water, Florida': 'Clear Water',
    'Cincinatti, OH': 'Cincinatti',
    'Edimburgh': 'Edinburgh',
    'Tonronto': 'Toronto',
    'Dornbirn & Lech': 'Dornbirn',
}


def geocode(query):
    cache_key = f'query-{query}'
    cached = get_cache(cache_key)
    if cached is not None:
        return cached

    # fix cases where no results were returned due to typos
    query = patches.get(query) or query

    params = {
        'q': query,
        'format': 'json',
        'limit': '1'
    }

    r = requests.get('https://nominatim.openstreetmap.org/search', params=params)
    r.raise_for_status()

    if query is None:
        print('query was none')

    if len(r.json()) == 0:
        logging.warning('Warning: nothing found for:', query)
        coords = {
            'lat': '0',
            'lon': '0'
        }
    else:
        coords = {
            'lat': r.json()[0]['lat'],
            'lon': r.json()[0]['lon']
        }

    set_cache(cache_key, coords)

    return coords
