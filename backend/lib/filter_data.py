import datetime


def filter_countries(confs, arg):
    country_list = arg.split(',')

    return [conf for conf in confs if conf.get('country') in country_list]


def filter_bbox(confs, arg):
    coords = arg.split(',')

    if len(coords) != 4:
        raise ValueError('Provide 4 coordinates seperated by \',\'')
    try:
        x1 = float(coords[0])
        y1 = float(coords[1])
        x2 = float(coords[2])
        y2 = float(coords[3])
    except ValueError:
        raise ValueError('Could not parse coords')

    def filter_func(conf):
        x = float(conf['coords']['lon'])
        y = float(conf['coords']['lat'])
        return (x1 <= x <= x2 or x2 <= x <= x1) and \
               (y1 <= y <= y2 or y2 <= y <= y1)

    return [conf for conf in confs if filter_func(conf)]


def filter_past(confs, arg):
    if arg != 'true':
        return confs

    def filter_func(conf):
        conf_date = datetime.datetime.strptime(conf['endDate'], '%Y-%m-%d')
        conf_date += datetime.timedelta(days=1)
        now = datetime.datetime.utcnow()

        return conf_date.date() > now.date()

    return [conf for conf in confs if filter_func(conf)]


def filter_from_date(confs, arg):
    try:
        from_date = datetime.datetime.strptime(arg, '%Y-%m-%d')
    except ValueError as e:
        raise e

    def filter_func(conf):
        conf_date = datetime.datetime.strptime(conf['endDate'], '%Y-%m-%d')

        return conf_date.date() >= from_date.date()

    return [conf for conf in confs if filter_func(conf)]


def filter_to_date(confs, arg):
    try:
        to_date = datetime.datetime.strptime(arg, '%Y-%m-%d')
    except ValueError as e:
        raise e

    def filter_func(conf):
        conf_date = datetime.datetime.strptime(conf['startDate'], '%Y-%m-%d')

        return conf_date.date() <= to_date.date()

    return [conf for conf in confs if filter_func(conf)]
