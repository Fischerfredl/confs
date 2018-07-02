import logging
import requests

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


def geocode(conf):
    city = conf.get('city')
    country = conf.get('country')
    if city is None:
        logging.warning('{}-{}: City is none'.format(conf['topic'], conf['year']))
        city = country

    cache_key = f'query-v2-{country}-{city}'
    cached = get_cache(cache_key)
    if cached is not None:
        return cached

    # fix cases where no results were returned due to typos
    city = patches.get(city) or city

    params = {
        'q': city,
        'country': country,
        'format': 'json',
        'limit': '1'
    }

    r = requests.get('https://nominatim.openstreetmap.org/search', params=params)
    r.raise_for_status()

    if len(r.json()) == 0:
        params.pop('country')
        r = requests.get('https://nominatim.openstreetmap.org/search', params=params)
        r.raise_for_status()

    if len(r.json()) == 0:
        logging.warning('Warning: nothing found for:', cache_key)
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
