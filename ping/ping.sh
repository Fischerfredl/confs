#!/bin/sh

sleep 15

while sleep 120; do curl -I http://backend/query; done