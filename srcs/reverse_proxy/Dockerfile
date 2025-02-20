From nginx:1.25

COPY default.conf /etc/nginx/conf.d/default.conf

RUN openssl req -x509 -nodes -days 365 -subj "/C=FR/ST=Paris/O=42, Inc./CN=localhost" \
-addext "subjectAltName=DNS:localhost,DNS:www.localhost" \
-newkey rsa:2048 -keyout /etc/ssl/private/transcendence.key -out /etc/ssl/certs/transcendence.crt;