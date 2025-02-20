#!/bin/bash

cd /pong

python manage.py makemigrations
sleep 5
python manage.py migrate
python manage.py runserver 0.0.0.0:8005