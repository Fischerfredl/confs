import json
import logging
import redis

from lib.config import redis_port, redis_host

r = redis.StrictRedis(host=redis_host, port=redis_port, db=0)
warned = False


def set_cache(key, data, expires=None):
    try:
        r.set(key, json.dumps(data))
        if expires:
            r.expire(key, expires)
    except redis.exceptions.ConnectionError:
        pass


def get_cache(key):
    global warned
    try:
        cached = r.get(key)
        if cached is not None:
            return json.loads(cached)
    except redis.exceptions.ConnectionError:
        if not warned:
            logging.warning("Could not connect to redis. No caching available")
            warned = True
