from lib.config import topics


def calendar_name(req_topics, req_countries):
    name = 'Muperconfs - '

    if req_topics is None:
        name += 'all Topics'
    else:
        name += ', '.join([topics[topic]['name'] for topic in req_topics.split(',')][:3])

        if len(req_topics.split(',')) > 3:
            name += ', ...'

    name += ' - '

    if req_countries is None:
        name += 'all Countries'
    else:
        name += ', '.join(req_countries.split(',')[:3])

        if len(req_countries.split(',')) > 3:
            name += ', ...'

    return name
