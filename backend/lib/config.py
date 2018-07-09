import os
import datetime

topics = {
    'android': dict(name='Android', tag='[Android]'),
    'css': dict(name='CSS', tag='[CSS]'),
    'data': dict(name='Data/AI', tag='[Data]'),
    'devops': dict(name='DevOps', tag='[DevOps]'),
    'dotnet': dict(name='.NET', tag='[.NET]'),
    'elixir': dict(name='Elixir', tag='[Elixir]'),
    'graphql': dict(name='GraphQL', tag='[GraphQL]'),
    'general': dict(name='General', tag='[General]'),
    'golang':dict(name='Golang', tag='[Go]'),
    'ios': dict(name='iOS/Swift', tag='[iOS]'),
    'javascript': dict(name='JavaScript', tag='[JS]'),
    'php': dict(name='PHP', tag='[PHP]'),
    'python': dict(name='Python', tag='[Python]'),
    'ruby': dict(name='Ruby', tag='[Ruby]'),
    'rust': dict(name='Rust', tag='[Rust]'),
    'scala': dict(name='Scala', tag='[Scala]'),
    'security': dict(name='Security', tag='[Security]'),
    'tech-comm': dict(name='Technical communication', tag='[Techcomm]'),
    'ux': dict(name='Design/UX', tag='[UX]')
}

min_year = 2014
max_year = datetime.datetime.utcnow().year + 1

redis_host = os.environ.get('REDIS_HOST', 'localhost')
redis_port = int(os.environ.get('REDIS_PORT', 6379))

request_cache = 300  # 5 min
processed_cache = 1800  # 30 min
fetch_cache = 14400  # 4 hours
