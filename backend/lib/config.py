import os

topics = {
    'android': dict(name='Android', tag='[Android]'),
    'css': dict(name='CSS', tag='[CSS]'),
    'data': dict(name='Data/AI', tag='[Data]'),
    'devops': dict(name='DevOps', tag='[DevOps]'),
    'elixir': dict(name='Elixir', tag='[Elixir]'),
    'general': dict(name='General', tag='[General]'),
    'golang':dict(name='Golang', tag='[Go]'),
    'ios': dict(name='iOS/Swift', tag='[iOS]'),
    'javascript': dict(name='JavaScript', tag='[JS]'),
    'php': dict(name='PHP', tag='[PHP]'),
    'python': dict(name='Python', tag='[Python]'),
    'ruby': dict(name='Ruby', tag='[Ruby]'),
    'rust': dict(name='Rust', tag='[Rust]'),
    'security': dict(name='Security', tag='[Security]'),
    'tech-comm': dict(name='Technical communication', tag='[Techcomm]'),
    'ux': dict(name='Design/UX', tag='[UX]')
}

min_year = 2014
max_year = 2025

redis_host = os.environ.get('REDIS_HOST', 'localhost')
redis_port = int(os.environ.get('REDIS_PORT', 6379))

cache_seconds = int(os.environ.get('CACHE_SECONDS', 14400))
