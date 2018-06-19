import json


def to_geojson(confs):
    collection = {
        'type': 'FeatureCollection',
        'features': []
    }

    for conf in confs:
        coords = conf.pop('coords')
        collection['features'].append({
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [float(coords['lon']), float(coords['lat'])]
            },
            'properties': conf
        })

    return json.dumps(collection)
