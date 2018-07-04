import datetime

from icalendar import Calendar, Event


def to_ics(confs, calendar_name, add_cfp):
    """Writes confs to disk

    :type confs: list
    """

    timestamp = datetime.datetime.utcnow()

    cal = Calendar()
    cal.add('version', '2.0')
    cal.add('prodid', 'confs.muperfredi.de')
    cal.add('X-WR-CALNAME', calendar_name)
    cal.add('X-WR-CALDESC', 'Your personal conference feed. From confs.muperfredi.de made by Alfred Melch')

    for conf in confs:
        env = Event()

        env.add('dtstart', datetime.datetime.strptime(conf['startDate'], '%Y-%m-%d').date())
        env.add('dtend', datetime.datetime.strptime(conf['endDate'], '%Y-%m-%d').date())

        env.add('uid', conf['id'])
        env.add('dtstamp', timestamp)
        env.add('summary', conf['taggedName'])
        env.add('location', conf.get('city', '') + ', ' + conf.get('country', ''))
        env.add('description', conf.get('url', ''))

        cal.add_component(env)

        if add_cfp and conf.get('cfpEnd'):
            try:
                cfp_env = Event()
                cfp_env.add('dtstart', datetime.datetime.strptime(conf.get('cfpEnd'), '%Y-%m-%d').date())
                cfp_env.add('dtend', datetime.datetime.strptime(conf.get('cfpEnd'), '%Y-%m-%d').date())
                cfp_env.add('uid', 'cfp-' + conf['id'])
                cfp_env.add('dtstamp', timestamp)
                cfp_env.add('summary', '[CFP]' + conf['taggedName'])
                cfp_env.add('description', conf.get('cfpUrl', ''))

                cal.add_component(cfp_env)
            except ValueError:
                pass
    return cal.to_ical().decode('utf-8')
