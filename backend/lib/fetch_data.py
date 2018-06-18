import hashlib
import requests

from lib.config import topics, cache_seconds
from lib.geocode import geocode
from lib.redis_cache import get_cache, set_cache


def get_confs(req_topics, start_year, end_year):
    """Fetch all data from start_year to end_year for topic list"""

    data = list()

    for year in range(start_year, end_year+1):
        for topic in req_topics:
            data.extend(fetch(topic, year))

    return data


def fetch(topic, year):
    """Fetches data from https://github.com/tech-conferences/confs.tech

    :type topic: str
    :type year: str, int
    """

    # check if cached
    cache_key = f'{year}-{topic}'
    cached = get_cache(cache_key)
    if cached is not None:
        return cached

    # fetch from api
    src = 'https://raw.githubusercontent.com/tech-conferences/confs.tech/master/conferences/{year}/{topic}.json'
    # Hack: javascript confs are stored in a different repo
    if topic == 'javascript':
        src = 'https://raw.githubusercontent.com/tech-conferences/javascript-conferences/master/conferences/{year}/{topic}.json'

    if topic not in list(topics.keys()):
        return []

    r = requests.get(src.format(topic=topic, year=year))
    try:
        r.raise_for_status()
        confs = r.json()
    except requests.HTTPError:
        confs = []

    # remove entries with faulty date
    confs = [conf for conf in confs if conf.get('startDate') is not None]

    # add data
    for conf in confs:
        # add topic data
        conf['topic'] = topics[topic]['name']
        conf['tagged_name'] = topics[topic]['tag'] + ' ' + conf['name']
        # add year to data
        conf['year'] = year
        # add end date if missing
        if conf.get('endDate') is None:
            conf['endDate'] = conf['startDate']
        # add id
        id_string = '{year}|{topic}|{name}|{date}|{city}'.format(
            year=year,
            topic=topic,
            name=conf['name'],
            date=conf['startDate'],
            city=conf.get('city', 'no city'))
        conf['id'] = hashlib.sha1(id_string.encode('utf-8')).hexdigest()

        conf['coords'] = geocode(conf.get('city') or conf.get('country'))

    # uniquify list
    data = dict()
    for conf in confs:
        data[conf['id']] = conf
    data = list(data.values())

    set_cache(cache_key, data, cache_seconds)
    return data
