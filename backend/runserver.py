#!/usr/bin/env python
# -*- coding: utf-8 -*-

import hashlib
import json
import logging

from flask import Flask, jsonify, request, abort, Response
from flask_cors import CORS
from flask_json_errorhandler import init_errorhandler

from lib.config import topics, min_year, max_year, request_cache
from lib.filter_data import filter_bbox, filter_countries, filter_past, filter_from_date, filter_to_date
from lib import get_confs, to_ics, to_geojson
from lib.redis_cache import get_cache, set_cache
from lib.calendar_name import calendar_name


app = Flask(__name__)

CORS(app, expose_headers=['X-Total-Count'])
init_errorhandler(app)


@app.route('/query')
def query():
    # check cache
    cache_key = 'response-' + hashlib.sha1(request.query_string).hexdigest()
    cached = get_cache(cache_key)

    if cached is not None:
        return Response(cached['content'],
                        mimetype=cached['mimetype'],
                        headers={'X-Total-Count': cached['num_items']}), 200

    # cache miss: get data
    try:
        confs = get_confs(request.args.get('topics'), request.args.get('startYear'), request.args.get('endYear'))

        # filter by countries
        if request.args.get('countries'):
            confs = filter_countries(confs, request.args.get('countries'))

        # filter by bbox
        if request.args.get('bbox'):
            confs = filter_bbox(confs, request.args.get('bbox'))

        # filter by past dates
        if request.args.get('excludePast'):
            confs = filter_past(confs, request.args.get('excludePast'))

        # filter by from date
        if request.args.get('fromDate'):
            confs = filter_from_date(confs, request.args.get('fromDate'))

        # filter by past to date
        if request.args.get('toDate'):
            confs = filter_to_date(confs, request.args.get('toDate'))

    except ValueError as e:
        return abort(400, str(e))

    # determine format
    req_format = request.args.get('format', 'json')
    resp_obj = None

    if req_format == 'ical':
        cal_name = calendar_name(request.args.get('topics'), request.args.get('countries'))
        resp_obj = dict(content=to_ics(confs, cal_name, request.args.get('includeCfp') == 'true'), mimetype='text/calendar', num_items=len(confs))
    elif req_format == 'geojson':
        resp_obj = dict(content=to_geojson(confs), mimetype='application/geo+json', num_items=len(confs))
    elif req_format == 'json':
        resp_obj = dict(content=json.dumps(confs), mimetype='application/json', num_items=len(confs))

    if resp_obj is None:
        return abort(400, 'Format \'{}\' not supported.'.format(req_format))

    # set cache
    set_cache(cache_key, resp_obj, request_cache)

    return Response(resp_obj['content'],
                    mimetype=resp_obj['mimetype'],
                    headers={'X-Total-Count': resp_obj['num_items']}), 200


@app.route('/query/meta')
def meta():
    confs = get_confs()

    description = {
        'topics': list(topics.keys()),
        'countries': list(set([conf['country'] for conf in confs])),
        'minYear': min_year,
        'maxYear': max_year
    }

    return jsonify(description)


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.INFO)
    app.run(host='localhost', debug=True)
