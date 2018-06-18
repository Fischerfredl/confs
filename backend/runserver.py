#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, jsonify
from flask_json_errorhandler import init_errorhandler


app = Flask(__name__)

init_errorhandler(app)


@app.route('/query')
def pong():
    return jsonify(dict(ping='pong')), 200


if __name__ == '__main__':
    app.run(host='localhost', debug=True)
