#!/bin/bash

cd /front

python manage.py makemigrations
sleep 5
python manage.py migrate
python manage.py runserver 0.0.0.0:8000