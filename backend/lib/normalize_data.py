import calendar
import logging
import hashlib
from datetime import datetime

from lib.config import topics, processed_cache
from lib.geocode import geocode
from lib.redis_cache import set_cache, get_cache


def normalize_confs(confs, topic, year):
    # check if cached
    cache_key = f'processed-{year}-{topic}'
    cached = get_cache(cache_key)
    if cached is not None:
        return cached

    # normalize dates - add startDate from date if missing
    for conf in confs:
        if conf.get('startDate') is None:
            try:
                weird_date = conf['date']
                if '-' in weird_date:
                    first_part = datetime.strptime(weird_date.split('-')[0], '%B %d')
                    second_part = datetime.strptime(weird_date.split('-')[1], '%d, %Y')
                    start_date = datetime(second_part.year, first_part.month, first_part.day)
                    end_date = datetime(second_part.year, first_part.month, second_part.day)
                else:
                    start_date = datetime.strptime(weird_date, '%B %d, %Y')
                    end_date = datetime.strptime(weird_date, '%B %d, %Y')

                conf['startDate'] = start_date.strftime('%Y-%m-%d')
                conf['endDate'] = end_date.strftime('%Y-%m-%d')

                logging.info(f'{topic}-{year}: Conference has no startDate. But date could be parsed.')
            except ValueError as e:
                logging.warning(f'{topic}-{year}: Conference has no startDate. ' + str(e))
            except KeyError as e:
                logging.warning(f'{topic}-{year}: Conference has no startDate. Other date attribute could not be found')

    # remove entries with faulty dates
    confs = [conf for conf in confs if conf.get('startDate') is not None]

    # normalize dates: add end date if missing
    for conf in confs:
        if conf.get('endDate') is None:
            conf['endDate'] = conf['startDate']

    # normalize strings to format: %Y-%m-%d
    for conf in confs:
        # startDate
        try:
            start_date = datetime.strptime(conf['startDate'], '%Y-%m-%d')
        except ValueError:
            try:
                conf['startDate'] = datetime.strptime(conf['startDate'], '%Y-%m').strftime('%Y-%m-%d')
            except ValueError:
                conf.pop('startDate')

        # endDate
        try:
            end_date = datetime.strptime(conf['endDate'], '%Y-%m-%d')
        except ValueError:
            try:
                end_date = datetime.strptime(conf['endDate'], '%Y-%m')
                end_day = calendar.monthrange(year, end_date.month)[1]
                conf['endDate'] = datetime(end_date.year, end_date.month, end_day).strftime('%Y-%m-%d')
            except ValueError:
                if conf.get('startDate'):
                    conf.pop('startDate')

    # remove entries with faulty dates
    confs = [conf for conf in confs if conf.get('startDate') is not None]

    # normalize date: # fix incorrect dates
    for conf in confs:
        if conf['startDate'][0:3] != str(year):
            conf['startDate'] = str(year) + conf['startDate'][4:]

        if conf['endDate'][0:3] != str(year):
            conf['endDate'] = str(year) + conf['endDate'][4:]

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
        conf['coords'] = geocode(conf)

    # uniquify list
    data = dict()
    for conf in confs:
        data[conf['id']] = conf
    data = list(data.values())

    set_cache(cache_key, data, processed_cache)
    return data
