import datetime

from icalendar import Calendar, Event


def to_ics(confs):
    """Writes confs to disk

    :type confs: list
    """

    timestamp = datetime.datetime.utcnow()

    cal = Calendar()
    cal.add('version', '2.0')
    cal.add('prodid', 'confs.muperfredi.de')

    for conf in confs:
        env = Event()
        try:
            env.add('dtstart', datetime.datetime.strptime(conf['startDate'], '%Y-%m-%d').date())
        except ValueError:
            env.add('dtstart', datetime.datetime.strptime(conf['startDate'], '%Y-%m').date())
        try:
            env.add('dtend', datetime.datetime.strptime(conf['endDate'], '%Y-%m-%d').date())
        except ValueError:
            env.add('dtend', datetime.datetime.strptime(conf['endDate'], '%Y-%m').date())

        env.add('uid', conf['id'])
        env.add('dtstamp', timestamp)
        env.add('summary', conf['taggedName'])
        env.add('location', conf.get('city', '') + ', ' + conf.get('country', ''))
        env.add('description', conf.get('url', ''))

        cal.add_component(env)

    return cal.to_ical().decode('utf-8')
