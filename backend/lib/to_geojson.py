import json


def to_geojson(confs):
    collection = {
        'type': 'FeatureCollection',
        'features': []
    }

    for conf in confs:
        collection['features'].append({
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [conf['coords']['lon'], conf['coords']['lat']]
            },
            'properties': conf
        })

    return json.dumps(collection)
