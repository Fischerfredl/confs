import requests

from lib.config import topics, min_year, max_year, fetch_cache
from lib.normalize_data import normalize_confs
from lib.redis_cache import get_cache, set_cache


def get_confs(req_topics=None, start_year=None, end_year=None):
    """Fetch all data from start_year to end_year for topic list"""

    req_topics = req_topics or ','.join(topics.keys())
    start_year = start_year or min_year
    end_year = end_year or max_year

    # validate topics
    parsed_topics = req_topics.split(',')

    for topic in parsed_topics:
        if topic not in topics.keys():
            raise ValueError('Topic \'{topic}\' not valid'.format(topic=topic))

    # validate startYear
    try:
        start_year = int(start_year)
    except ValueError:
        raise ValueError('startYear must be valid integer.')

    if start_year > max_year or start_year < min_year:
        raise ValueError('startYear must be value between {min} and {max}.'.format(min=min_year, max=max_year))

    # validate endYear
    try:
        end_year = int(end_year)
    except ValueError:
        raise ValueError('endYear must be valid integer.')

    if end_year > max_year or end_year < min_year:
        raise ValueError('endYear must be value between {min} and {max}.'.format(min=min_year, max=max_year))

    if start_year > end_year:
        raise ValueError("startYear must not be greater than endYear.")

    # aggregate data
    data = list()

    for year in range(start_year, end_year+1):
        for topic in parsed_topics:
            tmp = fetch(topic, year)
            tmp = normalize_confs(tmp, topic, year)
            data.extend(tmp)
    return data


def fetch(topic, year):
    """Fetches data from https://github.com/tech-conferences/confs.tech

    :type topic: str
    :type year: str, int
    """

    # check if cached
    cache_key = f'raw-{year}-{topic}'
    cached = get_cache(cache_key)
    if cached is not None:
        return cached

    if topic not in list(topics.keys()):
        return []

    # fetch from api
    src = f'https://raw.githubusercontent.com/tech-conferences/conference-data/master/conferences/{year}/{topic}.json'
    r = requests.get(src)
    try:
        r.raise_for_status()
        confs = r.json()
    except requests.HTTPError:
        confs = []

    set_cache(cache_key, confs, fetch_cache)
    return confs
