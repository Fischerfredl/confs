#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, jsonify, request, abort, Response
from flask_cors import CORS
from flask_json_errorhandler import init_errorhandler

from lib.config import topics, min_year, max_year
from lib.filter_data import filter_bbox, filter_country
from lib import validate_year, validate_topics, get_confs, to_ics, to_geojson


app = Flask(__name__)

CORS(app)
init_errorhandler(app)


@app.route('/query')
def query():
    # evaluate params
    # topics
    try:
        req_topics = validate_topics(request.args.get('topics') or ','.join(topics.keys()))
    except ValueError as e:
        return abort(400, 'topics: ' + str(e))

    # startYear
    try:
        start_year = validate_year(request.args.get('startYear', min_year))
    except ValueError as e:
        return abort(400, 'startYear: ' + str(e))

    # endYear
    try:
        end_year = validate_year(request.args.get('endYear', max_year))
    except ValueError as e:
        return abort(400, 'endYear: ' + str(e))

    if start_year > end_year:
        raise ValueError("startYear must not be greater than endYear.")

    # get data
    confs = get_confs(req_topics, start_year, end_year)

    # filter by country
    if request.args.get('country'):
        confs = filter_country(confs, request.args.get('country'))

    # filter by bbox
    if request.args.get('bbox'):
        confs = filter_bbox(confs, request.args.get('bbox'))

    # determine format
    req_format = request.args.get('format', 'json')

    if req_format == 'ical':
        return Response(to_ics(confs), mimetype='text/calendar')
    if req_format == 'geojson':
        return Response(to_geojson(confs), mimetype='application/geo+json')
    if req_format != 'json':
        return abort(400, 'Format \'{}\' not supported.'.format(req_format))
    return jsonify(confs), 200


@app.route('/query/meta')
def meta():
    confs = get_confs(topics.keys(), min_year, max_year)

    description = {
        'topics': list(topics.keys()),
        'countries': list(set([conf['country'] for conf in confs])),
        'minYear': min_year,
        'maxYear': max_year
    }

    return jsonify(description)


if __name__ == '__main__':
    app.run(host='localhost', debug=True)
