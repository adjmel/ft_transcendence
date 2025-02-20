FROM python:3.10.13

RUN apt update -y && apt upgrade -y

COPY ./tools/requirements.txt .
COPY --chmod=777 ./tools/script.sh .
#  COPY . .

RUN apt install python3 \
    && pip install -r /requirements.txt \
    # && python manage.py makemigrations \
    # && python manage.py migrate \
    && pip install Django \
    && pip install -U djangorestframework \
    && pip install djangorestframework_simplejwt \
    && pip install django-otp \
    && pip install django-bootstrap-v5 \
    && apt install libpq-dev \
    && pip install psycopg2

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8003"]
ENTRYPOINT ["./script.sh"]