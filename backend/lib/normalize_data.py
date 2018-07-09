import calendar
import logging
import hashlib
from datetime import datetime

from lib.config import topics, processed_cache
from lib.geocode import geocode_conference
from lib.redis_cache import set_cache, get_cache


def check_conf(conf, identifier):
    required_fields = ['name', 'url', 'startDate', 'country', 'city']
    dateFields = ['startDate', 'endDate', 'cfpEndDate']

    for field in required_fields:
        if conf.get(field) is None:
            logging.warning('{}: Field  "{}" missing for conference: {}'
                            .format(identifier, field, conf.get('name', 'no name')))
            return False

    for field in dateFields:
        if conf.get(field):
            try:
                datetime.strptime(conf['startDate'], '%Y-%m-%d')
            except ValueError:
                logging.warning(identifier + ': Malformed data in conference ' + conf['name'])
                return False

    return True


def normalize_confs(confs, topic, year):
    # check if cached
    cache_key = f'processed-v2.1-{year}-{topic}'
    cached = get_cache(cache_key)
    if cached is not None:
        return cached

    # add end date if missing
    for conf in confs:
        if conf.get('endDate') is None and conf.get('startDate'):
            conf['endDate'] = conf['startDate']

    # remove malformed conferences
    confs = [conf for conf in confs if check_conf(conf, f'{year}-{topic}')]

    # add other data
    for conf in confs:
        # add topic
        conf['topic'] = topic
        conf['topicFullname'] = topics[topic]['name']
        conf['taggedName'] = topics[topic]['tag'] + ' ' + conf['name']
        # add year
        conf['year'] = year

        # add id
        id_string = '{year}|{topic}|{name}|{date}|{city}'.format(
            year=year,
            topic=topic,
            name=conf['name'],
            date=conf['startDate'],
            city=conf.get('city', 'no city'))
        conf['id'] = hashlib.sha1(id_string.encode('utf-8')).hexdigest()
        # add coords
        conf['coords'] = geocode_conference(conf)

    # uniquify list
    data = dict()
    for conf in confs:
        data[conf['id']] = conf
    data = list(data.values())

    set_cache(cache_key, data, processed_cache)
    return data
