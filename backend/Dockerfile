FROM python:3.6-alpine3.7

# early install of requirements
COPY requirements.txt /
RUN pip install -r /requirements.txt

COPY . /srv
WORKDIR /srv

CMD exec gunicorn --access-logfile - --bind 0.0.0.0:80 -w 4 runserver:app
