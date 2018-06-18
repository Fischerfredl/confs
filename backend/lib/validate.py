from lib.config import min_year, max_year, topics


def validate_year(year):
    """Validates that year is between minYear and maxYear. Raises ValueError otherwise."""

    try:
        parsed_year = int(year)
    except ValueError:
        raise ValueError('Year must be valid integer.')

    if parsed_year > max_year or  parsed_year < min_year:
        raise ValueError('Year must be value between {min} and {max}.'.format(min=min_year, max=max_year))

    return parsed_year


def validate_topics(req_topics):
    """Validates that all requested topics exist."""

    parsed_topics = req_topics.split(',')

    for topic in parsed_topics:
        if topic not in topics.keys():
            raise ValueError('Topic \'{topic}\' not valid'.format(topic=topic))

    return parsed_topics
