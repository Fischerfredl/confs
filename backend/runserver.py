#!/usr/bin/env python
# -*- coding: utf-8 -*-

import hashlib
import json
from flask import Flask, jsonify, request, abort, Response
from flask_cors import CORS
from flask_json_errorhandler import init_errorhandler

from lib.config import topics, min_year, max_year
from lib.filter_data import filter_bbox, filter_country
from lib import get_confs, to_ics, to_geojson
from lib.redis_cache import get_cache, set_cache


app = Flask(__name__)

CORS(app)
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
    except ValueError as e:
        return abort(400, str(e))

    # filter by country
    if request.args.get('country'):
        confs = filter_country(confs, request.args.get('country'))

    # filter by bbox
    if request.args.get('bbox'):
        confs = filter_bbox(confs, request.args.get('bbox'))

    # determine format
    req_format = request.args.get('format', 'json')
    resp_obj = None

    if req_format == 'ical':
        resp_obj = dict(content=to_ics(confs), mimetype='text/calendar', num_items=len(confs))
    elif req_format == 'geojson':
        resp_obj = dict(content=to_geojson(confs), mimetype='application/geo+json', num_items=len(confs))
    elif req_format == 'json':
        resp_obj = dict(content=json.dumps(confs), mimetype='application/json', num_items=len(confs))

    if resp_obj is None:
        return abort(400, 'Format \'{}\' not supported.'.format(req_format))

    # set cache
    set_cache(cache_key, resp_obj, 60)

    return Response(resp_obj['content'],
                    mimetype=resp_obj['mimetype'],
                    headers={'X-Total-Count': resp_obj['num_items']}), 200


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
